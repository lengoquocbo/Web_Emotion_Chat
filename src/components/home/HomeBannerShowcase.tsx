import { ArrowRight, HeartHandshake, LineChart, MessageSquareHeart, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import bgImage from '@/assets/img/bg.jpg'
import thienImage from '@/assets/img/thien.jpg'

type BannerCardProps = {
  eyebrow: string
  title: string
  description: string
  cta: string
  to: string
  icon: React.ComponentType<{ className?: string }>
  tone?: 'sky' | 'emerald' | 'amber' | 'rose'
  large?: boolean
  image?: string
  art?: 'none' | 'analytics'
}

const toneClasses: Record<NonNullable<BannerCardProps['tone']>, string> = {
  sky: 'from-sky-950/70 via-sky-900/30 to-sky-950/10',
  emerald: 'from-emerald-950/70 via-emerald-900/25 to-emerald-950/10',
  amber: 'from-amber-950/70 via-amber-900/25 to-amber-950/10',
  rose: 'from-rose-950/70 via-rose-900/25 to-rose-950/10',
}

function AnalyticsArtwork() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_42%,#0f766e_100%)]" />
      <div className="absolute right-10 top-10 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute bottom-8 left-10 h-36 w-36 rounded-full bg-amber-300/20 blur-3xl" />
      <div className="absolute inset-x-10 bottom-12 flex h-32 items-end gap-3">
        {[38, 58, 74, 52, 86, 64].map((height, index) => (
          <div
            key={index}
            className={`flex-1 rounded-t-[1.2rem] ${
              index === 4 ? 'bg-cyan-300/90' : 'bg-white/18'
            }`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className="absolute inset-x-10 top-14 h-28">
        <svg viewBox="0 0 320 120" className="h-full w-full">
          <path
            d="M0 86 C 36 72, 70 98, 106 70 S 176 32, 212 44 S 286 90, 320 38"
            fill="none"
            stroke="rgba(255,255,255,0.82)"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  )
}

function BannerCard({
  eyebrow,
  title,
  description,
  cta,
  to,
  icon: Icon,
  tone = 'sky',
  large = false,
  image,
  art = 'none',
}: BannerCardProps) {
  return (
    <article
      className={`group relative overflow-hidden rounded-[2rem] shadow-[0_22px_60px_rgba(15,23,42,0.10)] ${
        large ? 'min-h-[360px] sm:min-h-[420px]' : 'min-h-[240px] sm:min-h-[260px]'
      }`}
    >
      {image ? (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      ) : null}
      {art === 'analytics' ? <AnalyticsArtwork /> : null}
      <div className={`absolute inset-0 bg-gradient-to-br ${toneClasses[tone]}`} />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-950/75 via-slate-900/15 to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-7">
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/18 px-4 py-2 backdrop-blur-sm">
          <Icon className="size-4 text-white" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90">
            {eyebrow}
          </span>
        </div>

        <div className="max-w-xl space-y-3">
          <h2 className={`${large ? 'text-3xl sm:text-4xl' : 'text-2xl'} font-semibold tracking-tight text-white`}>
            {title}
          </h2>
          <p className="max-w-lg text-sm leading-7 text-white/78 sm:text-[15px]">
            {description}
          </p>
          <Link
            to={to}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-[0_14px_28px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-50"
          >
            {cta}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function HomeBannerShowcase() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Gợi ý hôm nay
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-800">
          Chọn một nhịp chăm sóc phù hợp với bạn
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-500">
          Trang chủ giờ tập trung vào những lối vào nhanh nhất để bạn check-in, trò chuyện và nhìn lại tiến trình của mình.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <BannerCard
          eyebrow="AI Support"
          title="Bắt đầu một phiên check-in có hướng dẫn"
          description="Đi qua từng bước để nói ra cảm xúc hiện tại, điều đang làm bạn nặng lòng và nhận lại bản tóm tắt rõ ràng trước khi tìm nhóm phù hợp."
          image={thienImage}
          cta="Mở check-in"
          to="/ai?start=1"
          icon={MessageSquareHeart}
          tone="sky"
          large
        />

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
          <BannerCard
            eyebrow="Friends"
            title="Tìm một người bạn để nhắn gửi"
            description="Mở nhanh danh sách bạn bè hoặc khám phá những kết nối mới khi bạn cần một cuộc trò chuyện riêng."
            image={bgImage}
            cta="Đến Friends"
            to="/friends"
            icon={HeartHandshake}
            tone="rose"
          />

          <BannerCard
            eyebrow="Groups"
            title="Quay lại phòng trò chuyện của bạn"
            description="Tiếp tục cuộc trò chuyện đang chờ, gửi reflection và theo dõi cách cảm xúc thay đổi trong từng phòng."
            image={bgImage}
            cta="Mở Groups"
            to="/groups"
            icon={Users}
            tone="emerald"
          />

          <BannerCard
            eyebrow="Analytics"
            title="Nhìn lại tiến trình cảm xúc"
            description="Xem timeline reflection, cảm xúc trước sau và các tag nổi bật để hiểu rõ nhịp thay đổi của chính mình."
            cta="Xem phân tích"
            to="/analytics"
            icon={LineChart}
            tone="amber"
            art="analytics"
          />
        </div>
      </div>
    </section>
  )
}
