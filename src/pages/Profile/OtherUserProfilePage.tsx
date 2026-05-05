import { useEffect, useMemo, useState } from 'react'
import { Mail, MessageCircleMore, Phone, UserPlus, X } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import ProfileAchievementsCard from '@/components/profile/ProfileAchievementsCard'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/auth/useAuth'
import { getUserProfile } from '@/services/authService'
import { friendshipService } from '@/services/friendshipService'
import type { AuthUser } from '@/types/auth'
import type { FriendshipDto } from '@/types/friendship'

function buildProfileFallback(userId?: string): AuthUser {
  return {
    id: userId ?? 'unknown',
    username: 'guest.profile',
    email: 'profile@example.com',
    displayName: 'Guest Profile',
    phone: '+84 900 000 000',
  }
}

export default function OtherUserProfilePage() {
  const { user } = useAuth()
  const { userId } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<AuthUser>(() => buildProfileFallback(userId))
  const [friendship, setFriendship] = useState<FriendshipDto | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [loadingRelationship, setLoadingRelationship] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const profileName = profile.displayName || profile.username
  const profileInitials = useMemo(
    () =>
      profileName
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join(''),
    [profileName],
  )

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) {
        setLoadingProfile(false)
        return
      }

      setLoadingProfile(true)
      console.log('[OtherUserProfile] loadProfile:start', { userId })

      try {
        const data = await getUserProfile(userId)
        console.log('[OtherUserProfile] loadProfile:success', { userId, data })
        setProfile(data)
      } catch (error) {
        console.error('[OtherUserProfile] loadProfile:error', { userId, error })
        setProfile(buildProfileFallback(userId))
        setError((current) => current ?? 'Unable to load profile details.')
      } finally {
        setLoadingProfile(false)
      }
    }

    void loadProfile()
  }, [userId])

  useEffect(() => {
    const loadRelationship = async () => {
      if (!userId) {
        setLoadingRelationship(false)
        return
      }

      setLoadingRelationship(true)
      setError(null)
      console.log('[OtherUserProfile] loadRelationship:start', { userId })

      const result = await friendshipService.GetWithUser(userId)
      console.log('[OtherUserProfile] loadRelationship:result', { userId, result })

      if (result.success && result.data) {
        setFriendship(result.data)
      } else if (result.status === 204 || result.status === 404) {
        setFriendship(null)
      } else {
        setError(result.message ?? 'Unable to load friendship state.')
      }

      setLoadingRelationship(false)
    }

    void loadRelationship()
  }, [userId])

  const relationshipUi = useMemo(() => {
    if (!friendship) {
      return {
        state: 'none' as const,
      }
    }

    if (friendship.status === 'Accepted') {
      return {
        state: 'accepted' as const,
      }
    }

    if (friendship.status === 'Pending' && friendship.requesterId === user?.id) {
      return {
        state: 'outgoing-pending' as const,
      }
    }

    if (friendship.status === 'Pending') {
      return {
        state: 'incoming-pending' as const,
      }
    }

    return {
      state: 'none' as const,
    }
  }, [friendship, user?.id])

  const handleFriendAction = async (action: 'add' | 'cancel' | 'accept' | 'reject' | 'remove') => {
    if (!userId) return
    setActionLoading(true)
    setError(null)
    console.log('[OtherUserProfile] handleFriendAction:start', { userId, action, friendship })

    try {
      if (action === 'add') {
        const result = await friendshipService.AddFriend(userId)
        console.log('[OtherUserProfile] handleFriendAction:add:result', { userId, result })
        if (!result.success || !result.data) {
          setError(result.message ?? 'Unable to send friend request.')
          return
        }

        setFriendship(result.data)
        return
      }

      if (action === 'cancel' && friendship) {
        const result = await friendshipService.Cancel(friendship.id)
        console.log('[OtherUserProfile] handleFriendAction:cancel:result', {
          userId,
          friendshipId: friendship.id,
          result,
        })
        if (!result.success) {
          setError(result.message ?? 'Unable to cancel friend request.')
          return
        }

        setFriendship(null)
        return
      }

      if (action === 'accept' && friendship) {
        const result = await friendshipService.AcceptFriendRequest(friendship.id)
        console.log('[OtherUserProfile] handleFriendAction:accept:result', {
          userId,
          friendshipId: friendship.id,
          result,
        })
        if (!result.success || !result.data) {
          setError(result.message ?? 'Unable to accept friend request.')
          return
        }

        setFriendship(result.data)
        return
      }

      if (action === 'reject' && friendship) {
        const result = await friendshipService.Reject(friendship.id)
        console.log('[OtherUserProfile] handleFriendAction:reject:result', {
          userId,
          friendshipId: friendship.id,
          result,
        })
        if (!result.success) {
          setError(result.message ?? 'Unable to reject friend request.')
          return
        }

        setFriendship(null)
        return
      }

      if (action === 'remove' && friendship) {
        const result = await friendshipService.Remove(friendship.id)
        console.log('[OtherUserProfile] handleFriendAction:remove:result', {
          userId,
          friendshipId: friendship.id,
          result,
        })
        if (!result.success) {
          setError(result.message ?? 'Unable to remove friend.')
          return
        }

        setFriendship(null)
      }
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <section className="overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_48px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
        <div className="h-28 bg-[linear-gradient(135deg,rgba(236,253,245,0.95),rgba(239,246,255,0.95))]" />

        <div className="px-6 pb-5 sm:px-8">
          <div className="-mt-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              <div className="flex size-24 items-center justify-center rounded-full border-[6px] border-white bg-gradient-to-br from-amber-300 via-orange-300 to-yellow-200 text-3xl font-semibold text-slate-800 shadow-[0_18px_40px_rgba(251,191,36,0.3)]">
                {profileInitials}
              </div>

              <div className="pb-1">
                <h2 className="text-[1.8rem] font-semibold tracking-tight text-fuchsia-700">
                  {profileName}
                </h2>
                <div className="mt-2 space-y-1.5 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-fuchsia-500" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-fuchsia-500" />
                    <span>{profile.phone ?? 'No phone shared'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {relationshipUi.state === 'none' ? (
                <>
                  <Button
                    onClick={() => void handleFriendAction('add')}
                    disabled={loadingProfile || loadingRelationship || actionLoading}
                    className="h-11 rounded-full bg-sky-700 px-5 text-white hover:bg-sky-800"
                  >
                    <UserPlus className="size-4" />
                    {loadingProfile || loadingRelationship ? 'Loading...' : actionLoading ? 'Working...' : 'Add Friend'}
                  </Button>

                  <Button
                    onClick={() => navigate('/friends')}
                    variant="outline"
                    className="h-11 rounded-full border-fuchsia-300 px-5 text-fuchsia-700 hover:bg-fuchsia-50 hover:text-fuchsia-800"
                  >
                    <MessageCircleMore className="size-4" />
                    Message
                  </Button>
                </>
              ) : null}

              {relationshipUi.state === 'outgoing-pending' ? (
                <Button
                  onClick={() => void handleFriendAction('cancel')}
                  disabled={loadingProfile || loadingRelationship || actionLoading}
                  variant="outline"
                  className="h-11 rounded-full border-rose-200 px-5 text-rose-700 hover:bg-rose-50"
                >
                  <X className="size-4" />
                  {loadingProfile || loadingRelationship ? 'Loading...' : actionLoading ? 'Working...' : 'Cancel Request'}
                </Button>
              ) : null}

              {relationshipUi.state === 'incoming-pending' ? (
                <>
                  <Button
                    onClick={() => void handleFriendAction('accept')}
                    disabled={loadingProfile || loadingRelationship || actionLoading}
                    className="h-11 rounded-full bg-emerald-600 px-5 text-white hover:bg-emerald-700"
                  >
                    <UserPlus className="size-4" />
                    {loadingProfile || loadingRelationship ? 'Loading...' : actionLoading ? 'Working...' : 'Accept'}
                  </Button>

                  <Button
                    onClick={() => void handleFriendAction('reject')}
                    disabled={loadingProfile || loadingRelationship || actionLoading}
                    variant="outline"
                    className="h-11 rounded-full border-rose-200 px-5 text-rose-700 hover:bg-rose-50"
                  >
                    <X className="size-4" />
                    Reject
                  </Button>
                </>
              ) : null}

              {relationshipUi.state === 'accepted' ? (
                <>
                  <Button
                    disabled
                    variant="secondary"
                    className="h-11 rounded-full bg-emerald-100 px-5 text-emerald-800 hover:bg-emerald-100"
                  >
                    <UserPlus className="size-4" />
                    Friend
                  </Button>

                  <Button
                    onClick={() => navigate('/friends')}
                    variant="outline"
                    className="h-11 rounded-full border-fuchsia-300 px-5 text-fuchsia-700 hover:bg-fuchsia-50 hover:text-fuchsia-800"
                  >
                    <MessageCircleMore className="size-4" />
                    Message
                  </Button>

                  <Button
                    onClick={() => void handleFriendAction('remove')}
                    disabled={loadingProfile || loadingRelationship || actionLoading}
                    variant="outline"
                    className="h-11 rounded-full border-slate-200 px-5 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  >
                    <X className="size-4" />
                    Unfriend
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-[1.5rem] bg-rose-50 px-5 py-4 text-sm text-rose-700">{error}</div>
      ) : null}

      <ProfileAchievementsCard mode="placeholder" />
    </div>
  )
}
