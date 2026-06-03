import { useCallback, useEffect, useState } from 'react'
import {
  getAdminAccessRules,
  getAdminAchievements,
  getAdminLoginAudits,
  getAdminRooms,
  getAdminUsers,
} from '@/services/adminService'
import type {
  AdminAccessRule,
  AdminAchievement,
  AdminLoginAudit,
  AdminRoomRow,
  AdminUserRow,
} from '@/types/admin'

export function useAdminDashboard() {
  const [users, setUsers] = useState<AdminUserRow[]>([])
  const [rooms, setRooms] = useState<AdminRoomRow[]>([])
  const [loginAudits, setLoginAudits] = useState<AdminLoginAudit[]>([])
  const [achievements, setAchievements] = useState<AdminAchievement[]>([])
  const [accessRules, setAccessRules] = useState<AdminAccessRule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [usersResult, roomsResult, auditsResult, achievementsResult, rulesResult] =
        await Promise.all([
          getAdminUsers({ take: 50 }),
          getAdminRooms({ take: 50 }),
          getAdminLoginAudits(50),
          getAdminAchievements(),
          getAdminAccessRules(),
        ])

      setUsers(usersResult.items)
      setRooms(roomsResult.items)
      setLoginAudits(auditsResult)
      setAchievements(achievementsResult)
      setAccessRules(rulesResult)
    } catch {
      setError('Khong tai duoc du lieu admin.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadDashboard()
  }, [loadDashboard])

  return {
    users,
    rooms,
    loginAudits,
    achievements,
    accessRules,
    loading,
    error,
    reload: loadDashboard,
  }
}