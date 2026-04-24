type AICheckInWelcomeProps = {
  isStarting: boolean
  onStart: () => void
}

export default function AICheckInWelcome({ isStarting, onStart }: AICheckInWelcomeProps) {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center rounded-[2.5rem] bg-white px-8 py-10 text-center shadow-[0_24px_55px_rgba(15,23,42,0.08)]">
      <span className="rounded-full bg-sky-100 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-800">
        Guided Check-in
      </span>

      <h3 className="mt-5 text-[2rem] font-semibold tracking-tight text-slate-800 md:text-[2.2rem]">
        Bắt đầu phiên check-in với sự hỗ trợ của AI
      </h3>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
       AI sẽ đồng hành cùng bạn, giúp bạn nói ra cảm xúc hiện tại, vấn đề của bản thân và sau đó đi sâu vào nguyên nhân cốt lõi của vấn đề.
      </p>

      <div className="mt-8 grid w-full gap-3 rounded-[2rem] bg-slate-50 p-5 text-left text-xs text-slate-600 md:grid-cols-3 md:text-sm">
        <div className="rounded-[1.5rem] bg-white px-4 py-4 shadow-sm">
          <p className="font-semibold text-slate-800">1. Emotion</p>
          <p className="mt-2 leading-6">Xác nhận cảm xúc hiện tại của bản thân.</p>
        </div>
        <div className="rounded-[1.5rem] bg-white px-4 py-4 shadow-sm">
          <p className="font-semibold text-slate-800">2. Issue & Deep Dive</p>
          <p className="mt-2 leading-6">Làm rõ vấn đề bản thân đang mắc phải.</p>
        </div>
        <div className="rounded-[1.5rem] bg-white px-4 py-4 shadow-sm">
          <p className="font-semibold text-slate-800">3. Review</p>
          <p className="mt-2 leading-6">Trình bày phiên bản diễn giải đã được tổng hợp.</p>
        </div>
      </div>

      <button
        onClick={onStart}
        disabled={isStarting}
        className="mt-10 inline-flex h-13 items-center justify-center rounded-full bg-sky-800 px-20 py-4 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(3,105,161,0.24)] transition hover:-translate-y-0.5 hover:bg-sky-900 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none md:text-base"
      >
        {isStarting ? 'Đang khởi tạo...' : 'Bắt đầu check-in'}
      </button>
    </section>
  )
}
