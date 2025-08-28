import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PrismaClient } from '@prisma/client'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { notifyAllAdmins, NotificationTemplates } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const registrationType = formData.get('registrationType') as string;
    const isTeamRegistration = formData.get('isTeamRegistration') === 'true';
    
    // Parse participant data
    const leaderInfo = JSON.parse(formData.get('leaderInfo') as string || '{}');
    const members = isTeamRegistration ? JSON.parse(formData.get('members') as string || '[]') : [];
    
    // Team-specific data
    const teamName = isTeamRegistration ? formData.get('teamName') as string : null;
    const hackathonTrack = isTeamRegistration ? formData.get('hackathonTrack') as string : null;
    const ideaDescription = isTeamRegistration ? formData.get('ideaDescription') as string : null;
    const hearAboutUs = isTeamRegistration ? formData.get('hearAboutUs') as string : null;
    
    const attachmentFile = formData.get('attachment') as File | null;
    let attachmentPath: string | null = null;

    if (attachmentFile) {
        const bytes = await attachmentFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const filename = `${Date.now()}_${attachmentFile.name}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        const filePath = path.join(uploadDir, filename);
        
        // Ensure the upload directory exists
        await mkdir(uploadDir, { recursive: true });

        await writeFile(filePath, buffer);
        attachmentPath = `/uploads/${filename}`;
    }

    // Basic validation
    if (!leaderInfo || !leaderInfo.email || !leaderInfo.fullName) {
      return NextResponse.json({ error: 'Required participant fields are missing.' }, { status: 400 })
    }
    
    if (isTeamRegistration) {
      if (!teamName || !hackathonTrack || !ideaDescription) {
        return NextResponse.json({ error: 'Required team fields are missing.' }, { status: 400 })
      }
      
      if (!members || members.length < 2 || members.length > 4) {
        return NextResponse.json({ error: 'A team must have between 3 and 5 members total (including leader).' }, { status: 400 })
      }
    }

    // Check if any email already exists
    const allEmails = [leaderInfo.email, ...members.map((m: any) => m.email)].filter(Boolean)
    if (allEmails.length > 0) {
      const existingParticipants = await prisma.participant.findMany({
        where: { email: { in: allEmails } },
      })

      if (existingParticipants.length > 0) {
        return NextResponse.json(
          { error: 'One or more email addresses are already registered.' },
          { status: 400 }
        )
      }
    }

    const result = await prisma.$transaction(async (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => {
      // Create team record (even for individual registrations)
      const team = await tx.team.create({
        data: {
          teamName: teamName || `Individual - ${leaderInfo.fullName}`,
          status: 'pending',
          challenge: hackathonTrack || '',
          challengeReason: '',
          ideaName: teamName || `Individual - ${leaderInfo.fullName}`,
          ideaDescription: ideaDescription || '',
          ideaSolution: '',
          ideaResults: '',
          ideaStage: 'idea',
          hasParticipated: false,
          participationDetails: hearAboutUs || '',
          attachmentPath: attachmentPath,
        },
      });
      const teamId = team.id;

      // Create leader/individual participant
      await tx.participant.create({
        data: {
          // Map new CSV fields to old structure temporarily
          firstName: leaderInfo.fullName || '',
          secondName: '',
          familyName: '',
          nationalId: '',
          dob: '',
          email: leaderInfo.email,
          phoneNumber: leaderInfo.contactNumber || '',
          education: leaderInfo.universityMajor || '',
          university: leaderInfo.university || '',
          major: leaderInfo.universityMajor || '',
          employmentStatus: leaderInfo.professionalField || '',
          nationality: leaderInfo.gender || '',
          residence: leaderInfo.city || '',
          canAttend: leaderInfo.canAttendHackathon || false,
          isLeader: isTeamRegistration,
          teamId: teamId,
        },
      });

      // Create team members if it's a team registration
      if (isTeamRegistration && members && members.length > 0) {
        for (const member of members) {
          await tx.participant.create({
            data: {
              // Map new CSV fields to old structure temporarily
              firstName: member.fullName || '',
              secondName: '',
              familyName: '',
              nationalId: '',
              dob: '',
              email: member.email,
              phoneNumber: member.contactNumber || '',
              education: member.universityMajor || '',
              university: member.university || '',
              major: member.universityMajor || '',
              employmentStatus: member.professionalField || '',
              nationality: member.gender || '',
              residence: member.city || '',
              canAttend: member.canAttendHackathon || false,
              isLeader: false,
              teamId: teamId,
            },
          })
        }
      }

      return { teamId, teamName: teamName || `Individual - ${leaderInfo.fullName}` };
    })

    // Create notification for admins about new registration
    try {
      const template = NotificationTemplates.newTeamRegistration(result.teamName);
      await notifyAllAdmins(
        template.title,
        template.message,
        template.type,
        {
          relatedEntityType: 'team',
          relatedEntityId: result.teamId,
          actionUrl: template.actionUrl,
        }
      );
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Don't fail the registration if notification fails
    }

    return NextResponse.json(
      {
        success: true,
        message: `${isTeamRegistration ? 'Team' : 'Individual'} registration submitted successfully`,
        teamId: result.teamId,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error registering:', error)
    return NextResponse.json(
      { error: 'Failed to register' },
      { status: 500 }
    )
  }
}
