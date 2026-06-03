import { useState } from 'react'
import {
  createAdminAccessRule,
  createAdminAchievement,
  createAdminUser,
  deleteAdminAccessRule,
  deleteAdminAchievement,
  deleteAdminUser,
  updateAdminAchievement,
  updateAdminUser,
} from '@/services/adminService'
import type {
  CreateAccessRuleRequest,
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
  UpsertAdminAchievementRequest,
} from '@/types/admin'

export function useAdminMutations(onSuccess?: () => Promise<void> | void) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const run = async (action: () => Promise<unknown>) => {
    setSaving(true)
    setError('')

    try {
      await action()
      await onSuccess?.()
      return true
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Thao tac that bai.')
      return false
    } finally {
      setSaving(false)
    }
  }

  return {
    saving,
    error,
    createUser: (data: CreateAdminUserRequest) => run(() => createAdminUser(data)),
    updateUser: (userId: string, data: UpdateAdminUserRequest) =>
      run(() => updateAdminUser(userId, data)),
    deleteUser: (userId: string) => run(() => deleteAdminUser(userId)),
    createAchievement: (data: UpsertAdminAchievementRequest) =>
      run(() => createAdminAchievement(data)),
    updateAchievement: (achievementId: string, data: UpsertAdminAchievementRequest) =>
      run(() => updateAdminAchievement(achievementId, data)),
    deleteAchievement: (achievementId: string) => run(() => deleteAdminAchievement(achievementId)),
    createAccessRule: (data: CreateAccessRuleRequest) => run(() => createAdminAccessRule(data)),
    deleteAccessRule: (ruleId: string) => run(() => deleteAdminAccessRule(ruleId)),
  }
}