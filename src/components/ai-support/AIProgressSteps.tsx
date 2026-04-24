import { checkInStepLabels, checkInStepOrder, type CheckInStage } from './ai-support-data'

type AIProgressStepsProps = {
  stage: CheckInStage
}

export default function AIProgressSteps({ stage }: AIProgressStepsProps) {
  const currentStage = stage === 'idle' ? 'emotion' : stage
  const activeIndex = checkInStepOrder.indexOf(currentStage)

  return (
    <section className="rounded-[2rem] bg-white/90 px-4 py-3 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
      <div className="flex flex-wrap gap-2.5">
        {checkInStepOrder.map((step, index) => {
          const isActive = index === activeIndex
          const isComplete = index < activeIndex

          return (
            <div
              key={step}
              className={`flex min-w-[110px] flex-1 items-center gap-2.5 rounded-[1.25rem] px-3 py-2.5 ${
                isActive
                  ? 'bg-sky-100 text-sky-900'
                  : isComplete
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'bg-slate-100 text-slate-500'
              }`}
            >
              <div
                className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                  isActive
                    ? 'bg-sky-800 text-white'
                    : isComplete
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-500'
                }`}
              >
                {index + 1}
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] opacity-60">Step</p>
                <p className="text-xs font-semibold md:text-sm">{checkInStepLabels[step]}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
