// Notification service for handling member invitations and other notifications

export interface Notification {
  id: string;
  type: 'invitation' | 'group_update' | 'event_reminder' | 'member_joined' | 'member_left';
  title: string;
  message: string;
  recipientId: string;
  groupId?: string;
  eventId?: string;
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface InvitationNotification extends Notification {
  type: 'invitation';
  groupId: string;
  groupName: string;
  inviterName: string;
  actionUrl: string;
}

// Mock notifications storage
let notifications: Notification[] = [];

export const notificationService = {
  // Send invitation notification
  async sendInvitationNotification(
    recipientEmail: string,
    groupId: string,
    groupName: string,
    inviterName: string
  ): Promise<void> {
    // In a real app, this would:
    // 1. Look up user by email
    // 2. Send email notification
    // 3. Create in-app notification
    // 4. Send push notification if user has app installed

    const notification: InvitationNotification = {
      id: `invite-${Date.now()}`,
      type: 'invitation',
      title: 'Group Invitation',
      message: `${inviterName} has invited you to join "${groupName}"`,
      recipientId: recipientEmail, // In real app, this would be user ID
      groupId,
      groupName,
      inviterName,
      actionUrl: `/groups/${groupId}/join`,
    isRead: false,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };

    notifications.push(notification);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`Invitation sent to ${recipientEmail} for group ${groupName}`);
  },

  // Get notifications for a user
  async getUserNotifications(userId: string): Promise<Notification[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return notifications.filter(n => n.recipientId === userId);
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  },

  // Accept group invitation
  async acceptInvitation(notificationId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const notification = notifications.find(n => n.id === notificationId) as InvitationNotification;
    if (notification && notification.type === 'invitation') {
      // In real app, this would:
      // 1. Add user to group
      // 2. Update user's group memberships
      // 3. Send confirmation to inviter
      // 4. Remove invitation notification
      console.log(`User accepted invitation to group ${notification.groupName}`);
    }
  },

  // Reject group invitation
  async rejectInvitation(notificationId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const notification = notifications.find(n => n.id === notificationId) as InvitationNotification;
    if (notification && notification.type === 'invitation') {
      // In real app, this would:
      // 1. Remove invitation notification
      // 2. Optionally notify inviter
      console.log(`User rejected invitation to group ${notification.groupName}`);
    }
  },

  // Send group update notification
  async sendGroupUpdateNotification(
    groupId: string,
    groupName: string,
    updateType: 'name_changed' | 'description_changed' | 'settings_changed',
    memberIds: string[]
  ): Promise<void> {
    const updateMessages = {
      name_changed: 'Group name has been updated',
      description_changed: 'Group description has been updated',
      settings_changed: 'Group settings have been updated'
    };

    const notifications = memberIds.map(memberId => ({
      id: `update-${Date.now()}-${memberId}`,
      type: 'group_update' as const,
      title: 'Group Updated',
      message: `${groupName}: ${updateMessages[updateType]}`,
      recipientId: memberId,
      groupId,
      isRead: false,
      createdAt: new Date().toISOString()
    }));

    // Add to notifications array
    notifications.forEach(notification => {
      // In real app, this would be stored in database
      console.log(`Group update notification sent to ${notification.recipientId}`);
    });
  }
};