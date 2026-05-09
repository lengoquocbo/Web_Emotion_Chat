import { useEffect, useMemo, useRef, useState } from 'react'
import { Camera, Mail, PencilLine, Phone, Save, X } from 'lucide-react'
import axios from 'axios'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/auth/useAuth'
import { UpdateProfileService, UploadAvatar } from '@/services/authService'

function buildInitials(displayName: string) {
  return displayName
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export default function ProfileOverviewCard() {
  const { user, updateUser } = useAuth()
  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [displayName, setDisplayName] = useState(user?.displayName || user?.username || '')
  const [bio, setBio] = useState(user?.Bio || '')
  const [avatarSaving, setAvatarSaving] = useState(false)
  const [infoSaving, setInfoSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDisplayName(user?.displayName || user?.username || '')
    setBio(user?.Bio || '')
  }, [user?.displayName, user?.username, user?.Bio])

  const resolvedDisplayName = user?.displayName || user?.username || 'User'
  const email = user?.email || 'No email'
  const phone = user?.phone || 'No phone'
  const avatarUrl = user?.avatarUrl || null
  const initials = useMemo(() => buildInitials(resolvedDisplayName), [resolvedDisplayName])

  const handleAvatarPick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setAvatarSaving(true)
    setError(null)

    try {
      const result = await UploadAvatar(file)
      updateUser({
        id: result.id,
        username: result.username,
        email: result.email,
        displayName: result.displayName,
        avatarUrl: URL.createObjectURL(file),
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || error.message || 'Unable to update avatar right now.')
      } else {
        setError('Unable to update avatar right now.')
      }
    } finally {
      setAvatarSaving(false)
      event.target.value = ''
    }
  }

  const handleSaveInfo = async () => {
    setInfoSaving(true)
    setError(null)

    try {
      const updated = await UpdateProfileService({
        displayName: displayName.trim(),
        bio: bio.trim(),
      })

      updateUser(updated)
      setIsEditingInfo(false)
    } catch {
      setError('Unable to update profile information right now.')
    } finally {
      setInfoSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setDisplayName(user?.displayName || user?.username || '')
    setBio(user?.Bio || '')
    setIsEditingInfo(false)
    setError(null)
  }

  return (
    <section className="overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_48px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
      <div className="h-28 bg-[linear-gradient(135deg,rgba(236,253,245,0.95),rgba(239,246,255,0.95))]" />

      <div className="px-6 pb-5 sm:px-8">
        <div className="-mt-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="relative">
              <div className="flex size-24 items-center justify-center overflow-hidden rounded-full border-[6px] border-white bg-gradient-to-br from-amber-300 via-orange-300 to-yellow-200 text-3xl font-semibold text-slate-800 shadow-[0_18px_40px_rgba(251,191,36,0.3)]">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={resolvedDisplayName} className="size-full object-cover" />
                ) : (
                  initials
                )}
              </div>

              <button
                onClick={handleAvatarPick}
                disabled={avatarSaving}
                className="absolute bottom-1 right-1 flex size-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.12)] transition hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Camera className="size-4" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => void handleAvatarChange(event)}
              />
            </div>

            <div className="min-w-0 pb-1">
              {isEditingInfo ? (
                <div className="min-w-0 space-y-3">
                  <input
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder="Display name"
                    className="h-11 w-full rounded-2xl bg-slate-50 px-4 text-base font-semibold text-slate-800 outline-none ring-1 ring-slate-200 focus:ring-sky-300"
                  />
                  <textarea
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    placeholder="Write a short bio..."
                    rows={3}
                    className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none ring-1 ring-slate-200 focus:ring-sky-300"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-[1.8rem] font-semibold tracking-tight text-fuchsia-700">
                    {resolvedDisplayName}
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    {user?.Bio || 'Add a short bio to help friends understand your rhythm and what kind of support feels good.'}
                  </p>
                </>
              )}

              <div className="mt-3 space-y-1.5 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-fuchsia-500" />
                  <span>{email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-fuchsia-500" />
                  <span>{phone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!isEditingInfo ? (
              <Button
                onClick={() => setIsEditingInfo(true)}
                variant="outline"
                className="h-11 rounded-full border-fuchsia-300 px-6 text-fuchsia-700 shadow-none hover:bg-fuchsia-50 hover:text-fuchsia-800"
              >
                <PencilLine className="size-4" />
                Edit Info
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSaveInfo}
                  disabled={infoSaving}
                  className="h-11 rounded-full bg-sky-700 px-6 text-white hover:bg-sky-800"
                >
                  <Save className="size-4" />
                  {infoSaving ? 'Saving...' : 'Save Info'}
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="h-11 rounded-full border-slate-200 px-6 text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-800"
                >
                  <X className="size-4" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>

        {avatarSaving ? (
          <p className="mt-4 text-sm font-medium text-sky-700">Uploading avatar...</p>
        ) : null}

        {error ? (
          <div className="mt-4 rounded-[1.25rem] bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
      </div>
    </section>
  )
}
