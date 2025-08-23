import { createNotification, NotificationTemplates } from './notifications';

export async function seedNotifications() {
  try {
    // Create sample admin notifications
    const adminNotifications = [
      {
        ...NotificationTemplates.newTeamRegistration("فريق الابتكار"),
        recipientType: "admin" as const,
        recipientId: "admin-1",
        relatedEntityType: "team",
        relatedEntityId: "team-1",
      },
      {
        ...NotificationTemplates.newMilestoneSubmission("فريق التقنية", "المرحلة الأولى"),
        recipientType: "admin" as const,
        recipientId: "admin-1",
        relatedEntityType: "milestone",
        relatedEntityId: "milestone-1",
      },
      {
        ...NotificationTemplates.eventCapacityWarning("ورشة البرمجة"),
        recipientType: "admin" as const,
        recipientId: "admin-1",
        relatedEntityType: "event",
        relatedEntityId: "event-1",
      },
    ];

    // Create sample participant notifications
    const participantNotifications = [
      {
        ...NotificationTemplates.teamApproval("فريق الابتكار"),
        recipientType: "participant" as const,
        recipientId: "participant-1",
        relatedEntityType: "team",
        relatedEntityId: "team-1",
      },
      {
        ...NotificationTemplates.eventRegistrationConfirmation("ورشة البرمجة"),
        recipientType: "participant" as const,
        recipientId: "participant-1",
        relatedEntityType: "event",
        relatedEntityId: "event-1",
      },
      {
        ...NotificationTemplates.newMilestoneAvailable("المرحلة الثانية"),
        recipientType: "participant" as const,
        recipientId: "participant-1",
        relatedEntityType: "milestone",
        relatedEntityId: "milestone-2",
      },
    ];

    // Create sample mentor notifications
    const mentorNotifications = [
      {
        ...NotificationTemplates.newBookingRequest("أحمد محمد", "2024-01-15 10:00"),
        recipientType: "mentor" as const,
        recipientId: "mentor-1",
        relatedEntityType: "booking",
        relatedEntityId: "booking-1",
      },
      {
        ...NotificationTemplates.mentorProfileApproval(),
        recipientType: "mentor" as const,
        recipientId: "mentor-1",
      },
    ];

    // Create all notifications
    const allNotifications = [
      ...adminNotifications,
      ...participantNotifications,
      ...mentorNotifications,
    ];

    for (const notification of allNotifications) {
      await createNotification(notification);
    }

    console.log(`Created ${allNotifications.length} sample notifications`);
    return { success: true, count: allNotifications.length };
  } catch (error) {
    console.error('Error seeding notifications:', error);
    return { success: false, error };
  }
}
