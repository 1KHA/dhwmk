import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PrismaClient } from '@prisma/client'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { notifyAllAdmins, NotificationTemplates } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const formState = {
        teamName: formData.get('teamName') as string,
        challenge: formData.get('challenge') as string,
        challengeReason: formData.get('challengeReason') as string,
        ideaName: formData.get('ideaName') as string,
        ideaDescription: formData.get('ideaDescription') as string,
        ideaSolution: formData.get('ideaSolution') as string,
        ideaResults: formData.get('ideaResults') as string,
        ideaStage: formData.get('ideaStage') as string,
        hasParticipated: formData.get('hasParticipated') === 'true',
        participationDetails: formData.get('participationDetails') as string,
        leaderInfo: JSON.parse(formData.get('leaderInfo') as string || '{}'),
        members: JSON.parse(formData.get('members') as string || '[]'),
    };
    
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

    const { teamName, challenge, challengeReason, ideaName, ideaDescription, ideaSolution, ideaResults, ideaStage, hasParticipated, participationDetails, leaderInfo, members } = formState;

    // Basic validation
    if (!leaderInfo || !leaderInfo.email || !teamName || !challenge || !ideaName) {
      return NextResponse.json({ error: 'Required fields are missing from the form submission.' }, { status: 400 })
    }
    
    if (teamName && (!members || members.length < 2 || members.length > 5)) {
      return NextResponse.json({ error: 'A team must have between 2 and 5 members.' }, { status: 400 })
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
      const team = await tx.team.create({
        data: {
          teamName: teamName || '',
          status: 'pending',
          challenge: challenge || '',
          challengeReason: challengeReason || '',
          ideaName: ideaName || '',
          ideaDescription: ideaDescription || '',
          ideaSolution: ideaSolution || '',
          ideaResults: ideaResults || '',
          ideaStage: ideaStage || '',
          hasParticipated: hasParticipated || false,
          participationDetails: participationDetails || null,
          attachmentPath,
        },
      });
      const teamId = team.id;

      await tx.participant.create({
        data: {
          ...leaderInfo,
          isLeader: true,
          teamId: teamId,
        },
      });

      if (members && members.length > 0) {
        for (const member of members) {
          await tx.participant.create({
            data: {
              ...member,
              isLeader: false,
              teamId: teamId,
            },
          })
        }
      }

      return { teamId, teamName };
    })

    // Create notification for admins about new team registration
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
        message: 'Team registration submitted successfully',
        teamId: result.teamId,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error registering team:', error)
    return NextResponse.json(
      { error: 'Failed to register team' },
      { status: 500 }
    )
  }
}
