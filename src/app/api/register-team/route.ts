import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PrismaClient } from '@prisma/client'
import { notifyAllAdmins, NotificationTemplates } from '@/lib/notifications'
import { uploadToBlob } from '@/lib/blob-storage'

// Ensure this route is dynamic
export const dynamic = 'force-dynamic';

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
    const hackathonTrack = formData.get('hackathonTrack') as string; // Required for both individual and team
    const ideaDescription = isTeamRegistration ? formData.get('ideaDescription') as string : null;
    const hearAboutUs = isTeamRegistration ? formData.get('hearAboutUs') as string : null;
    
    const attachmentFile = formData.get('attachment') as File | null;
    let attachmentPath: string | null = null;

    if (attachmentFile) {
        try {
            const filename = `${Date.now()}_${attachmentFile.name}`;
            // Upload file to blob storage in 'teams' folder
            attachmentPath = await uploadToBlob(attachmentFile, filename, 'teams');
        } catch (error) {
            console.error('Error uploading attachment to blob storage:', error);
            return NextResponse.json(
                { error: 'Failed to upload attachment' },
                { status: 500 }
            );
        }
    }

    // Basic validation
    if (!leaderInfo || !leaderInfo.email || !leaderInfo.fullName) {
      return NextResponse.json({ error: 'Required participant fields are missing.' }, { status: 400 })
    }
    
    // Hackathon track is required for both individual and team registrations
    if (!hackathonTrack) {
      return NextResponse.json({ error: 'Hackathon track selection is required.' }, { status: 400 })
    }
    
    if (isTeamRegistration) {
      if (!teamName || !ideaDescription) {
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
          hackathonTrack: hackathonTrack || '', // Use correct field
          ideaDescription: ideaDescription || '',
          hearAboutUs: hearAboutUs || '', // Use correct field
          isTeamRegistration: isTeamRegistration,
          attachmentPath: attachmentPath,
          // Keep deprecated fields for backward compatibility
          challenge: hackathonTrack || '',
          challengeReason: '',
          ideaName: teamName || `Individual - ${leaderInfo.fullName}`,
          ideaSolution: '',
          ideaResults: '',
          ideaStage: 'idea',
          hasParticipated: false,
          participationDetails: hearAboutUs || '',
        },
      });
      const teamId = team.id;

      // Create leader/individual participant
      await tx.participant.create({
        data: {
          // Use NEW CSV-based fields (primary)
          fullName: leaderInfo.fullName || '',
          contactNumber: leaderInfo.contactNumber || '',
          email: leaderInfo.email,
          gender: leaderInfo.gender || '',
          isUniversityStudent: leaderInfo.isUniversityStudent || false,
          universityMajor: leaderInfo.universityMajor || '',
          university: leaderInfo.university || '',
          professionalField: leaderInfo.professionalField || '',
          city: leaderInfo.city || '',
          canAttendHackathon: leaderInfo.canAttendHackathon || false,
          isLeader: isTeamRegistration,
          teamId: teamId,
          // Keep deprecated fields for backward compatibility
          firstName: leaderInfo.fullName || '',
          secondName: '',
          familyName: '',
          nationalId: '',
          dob: '',
          phoneNumber: leaderInfo.contactNumber || '',
          education: leaderInfo.universityMajor || '',
          major: leaderInfo.universityMajor || '',
          employmentStatus: leaderInfo.professionalField || '',
          nationality: leaderInfo.gender || '',
          residence: leaderInfo.city || '',
          canAttend: leaderInfo.canAttendHackathon || false,
        },
      });

      // Create team members if it's a team registration
      if (isTeamRegistration && members && members.length > 0) {
        for (const member of members) {
          await tx.participant.create({
            data: {
              // Use NEW CSV-based fields (primary)
              fullName: member.fullName || '',
              contactNumber: member.contactNumber || '',
              email: member.email,
              gender: member.gender || '',
              isUniversityStudent: member.isUniversityStudent || false,
              universityMajor: member.universityMajor || '',
              university: member.university || '',
              professionalField: member.professionalField || '',
              city: member.city || '',
              canAttendHackathon: member.canAttendHackathon || false,
              isLeader: false,
              teamId: teamId,
              // Keep deprecated fields for backward compatibility
              firstName: member.fullName || '',
              secondName: '',
              familyName: '',
              nationalId: '',
              dob: '',
              phoneNumber: member.contactNumber || '',
              education: member.universityMajor || '',
              major: member.universityMajor || '',
              employmentStatus: member.professionalField || '',
              nationality: member.gender || '',
              residence: member.city || '',
              canAttend: member.canAttendHackathon || false,
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
