export type NotificationType = 
'FriendRequestReceived' | 
'FriendRequestAccepted' | 
'AchievementUnlocked' | 
'RoomReady' | 
'MessageReceived'

export interface NotificationDto {
    Id: string,
    UserId : string,
    Type : NotificationType,
    title : string,
    body? : string,
    payloadJson : string | null,
    isRead : boolean,
    createdAt : string
    readAt? : string | null
}