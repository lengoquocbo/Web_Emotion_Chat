export type AchievementCategory = 'CheckIn' | 'Friendship' | 'Chat' | 'Reflection' | 'Streak' | 'Matching'

export interface AchievementDto {
    id : string,
    code : string,
    description : string,
    category : AchievementCategory,
    iconUrl : string | null,
    targetValue : number,
    isActive : boolean
}

export interface UserAchievementDto {
    id : string,
    userId : string,
    achievementId : string,
    isUnlocked : boolean,
    unlockedAt : string | null,
    progressValue : number,
    achievement : AchievementDto,
    progressPercentage : number,
    isCompleted : boolean
}

export interface AchievementProgressUpdateDto {
    code : string,
    previousProgress : number,
    currentProgress : number,
    targetValue : number,
    unLoackedNow : boolean,
    unLoackedAt : string | null 
}