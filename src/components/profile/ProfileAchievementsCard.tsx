import { useEffect, useMemo, useState } from 'react'
import {
  Award,
  Flame,
  HandHeart,
  MessageCircleHeart,
  MessagesSquare,
  Sparkles,
  Target,
} from 'lucide-react'

import { achievementService } from '@/services/achievementService'
import type { AchievementCategory, UserAchievementDto } from '@/types/achievement'

type ProfileAchievementsCardProps = {
  mode?: 'self' | 'placeholder'
}

const categoryMeta: Record<
  AchievementCategory,
  {
    icon: React.ComponentType<{ className?: string }>
    badgeClassName: string
    iconWrapClassName: string
  }
> = {
  CheckIn: {
    icon: Sparkles,
    badgeClassName: 'bg-sky-100 text-sky-800',
    iconWrapClassName: 'bg-sky-100 text-sky-700',
  },
  Friendship: {
    icon: HandHeart,
    badgeClassName: 'bg-emerald-100 text-emerald-800',
    iconWrapClassName: 'bg-emerald-100 text-emerald-700',
  },
  Chat: {
    icon: MessagesSquare,
    badgeClassName: 'bg-indigo-100 text-indigo-800',
    iconWrapClassName: 'bg-indigo-100 text-indigo-700',
  },
  Reflection: {
    icon: MessageCircleHeart,
    badgeClassName: 'bg-fuchsia-100 text-fuchsia-800',
    iconWrapClassName: 'bg-fuchsia-100 text-fuchsia-700',
  },
  Streak: {
    icon: Flame,
    badgeClassName: 'bg-amber-100 text-amber-800',
    iconWrapClassName: 'bg-amber-100 text-amber-700',
  },
  Matching: {
    icon: Target,
    badgeClassName: 'bg-cyan-100 text-cyan-800',
    iconWrapClassName: 'bg-cyan-100 text-cyan-700',
  },
}

function formatCategoryLabel(category: AchievementCategory) {
  switch (category) {
    case 'CheckIn':
      return 'Check-in'
    case 'Friendship':
      return 'Friendship'
    case 'Chat':
      return 'Chat'
    case 'Reflection':
      return 'Reflection'
    case 'Streak':
      return 'Streak'
    case 'Matching':
      return 'Matching'
    default:
      return category
  }
}

export default function ProfileAchievementsCard({
  mode = 'self',
}: ProfileAchievementsCardProps) {
  const [achievements, setAchievements] = useState<UserAchievementDto[]>([])
  const [loading, setLoading] = useState(mode === 'self')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (mode !== 'self') {
      setLoading(false)
      return
    }

    const loadAchievements = async () => {
      setLoading(true)
      setError(null)

      const result = await achievementService.GetMyAchievements()

      if (!result.success || !result.data) {
        setError(result.message ?? 'Unable to load achievements right now.')
        setAchievements([])
        setLoading(false)
        return
      }

      setAchievements(result.data)
      setLoading(false)
    }

    void loadAchievements()
  }, [mode])

  const featuredAchievements = useMemo(() => {
    return [...achievements]
      .sort((left, right) => {
        if (left.isUnlocked !== right.isUnlocked) {
          return left.isUnlocked ? -1 : 1
        }

        return right.progressPercentage - left.progressPercentage
      })
      .slice(0, 4)
  }, [achievements])

  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 sm:p-7">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-[0_10px_24px_rgba(251,191,36,0.25)]">
          <Award className="size-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700/75">Achievements</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-800">Your milestone gallery</h3>
        </div>
      </div>

      {mode !== 'self' ? (
        <div className="mt-5 rounded-[1.75rem] border border-dashed border-slate-200 bg-[linear-gradient(135deg,rgba(248,250,252,0.95),rgba(255,255,255,0.98))] px-6 py-8 text-center">
          <p className="text-base font-medium text-slate-700">Achievements will appear here soon.</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            This space is reserved for streak badges, support milestones, and future profile highlights.
          </p>
        </div>
      ) : loading ? (
        <div className="mt-5 rounded-[1.75rem] bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">
          Loading achievements...
        </div>
      ) : error ? (
        <div className="mt-5 rounded-[1.75rem] bg-rose-50 px-6 py-8 text-center text-sm text-rose-700">
          {error}
        </div>
      ) : featuredAchievements.length === 0 ? (
        <div className="mt-5 rounded-[1.75rem] border border-dashed border-slate-200 bg-[linear-gradient(135deg,rgba(248,250,252,0.95),rgba(255,255,255,0.98))] px-6 py-8 text-center">
          <p className="text-base font-medium text-slate-700">No achievements unlocked yet.</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Keep checking in, connecting with friends, and joining conversations to fill this gallery.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {featuredAchievements.map((item) => {
            const meta = categoryMeta[item.achievement.category]
            const Icon = meta.icon
            const progressValue = Math.max(0, Math.min(100, item.progressPercentage))

            return (
              <article
                key={item.id}
                title={item.achievement.description}
                className={`group rounded-[1.4rem] px-3 py-3 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.7)] transition ${
                  item.isUnlocked
                    ? 'bg-[linear-gradient(135deg,rgba(255,251,235,0.95),rgba(255,255,255,0.98))]'
                    : 'bg-[linear-gradient(135deg,rgba(248,250,252,0.95),rgba(255,255,255,0.98))] hover:bg-slate-50/90'
                }`}
              >
                <div className="relative flex h-full flex-col items-center text-center">
                  <div className={`flex size-14 shrink-0 items-center justify-center rounded-[1.35rem] ${meta.iconWrapClassName}`}>
                    {item.achievement.iconUrl ? (
                      <img
                        src={item.achievement.iconUrl}
                        alt={item.achievement.code}
                        className="size-7 object-contain"
                      />
                    ) : (
                      <Icon className="size-6" />
                    )}
                  </div>

                  <h4 className="mt-3 line-clamp-2 text-sm font-semibold leading-5 text-slate-800">
                    {item.achievement.code}
                  </h4>

                  <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-slate-400">
                    <span>{item.progressValue}/{item.achievement.targetValue}</span>
                    {item.isUnlocked ? (
                      <span className="text-amber-700">• done</span>
                    ) : (
                      <span>• {Math.round(progressValue)}%</span>
                    )}
                  </div>

                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
                    <div
                      className={`h-1.5 rounded-full transition-[width] duration-300 ${
                        item.isUnlocked ? 'bg-amber-400' : 'bg-sky-400'
                      }`}
                      style={{ width: `${progressValue}%` }}
                    />
                  </div>

                  <div className="pointer-events-none absolute inset-x-0 top-[calc(100%+0.5rem)] z-10 translate-y-1 rounded-2xl bg-slate-900 px-3 py-2 text-left text-[11px] leading-4 text-white opacity-0 shadow-[0_16px_36px_rgba(15,23,42,0.22)] transition duration-150 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="font-semibold text-slate-100">{formatCategoryLabel(item.achievement.category)}</p>
                    <p className="mt-1 text-slate-300">{item.achievement.description}</p>
                    <div className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-slate-900" />
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
