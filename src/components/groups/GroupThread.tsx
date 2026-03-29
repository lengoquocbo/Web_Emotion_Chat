import { CheckCheck } from 'lucide-react'

import { groupMessages } from './groups-data'

export default function GroupThread() {
  return (
    <section className="rounded-[2rem] bg-[linear-gradient(180deg,#fbfdff_0%,#fdfefe_100%)] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl space-y-12">
        {groupMessages.map((message) => {
          const isSelf = message.role === 'self'

          return (
            <div key={message.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[min(100%,820px)] ${isSelf ? 'items-end' : 'items-start'} flex flex-col`}>
                {!isSelf ? (
                  <p className="mb-2 text-xl font-semibold text-slate-700">{message.author}</p>
                ) : null}

                <div className={`flex items-end gap-4 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isSelf ? (
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${message.avatarTone} text-sm font-semibold text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)]`}
                    >
                      {message.initials}
                    </div>
                  ) : null}

                  <div
                    className={`rounded-[2rem] px-6 py-6 text-[1.08rem] leading-9 shadow-[0_18px_48px_rgba(15,23,42,0.06)] ${message.bubbleTone}`}
                  >
                    {message.text}
                  </div>
                </div>

                <div
                  className={`mt-3 flex items-center gap-2 text-sm text-slate-400 ${
                    isSelf ? 'justify-end pr-4' : 'justify-start pl-[3.75rem]'
                  }`}
                >
                  <span>{message.time}</span>
                  {isSelf ? <CheckCheck className="size-4 text-sky-700" /> : null}
                </div>
              </div>
            </div>
          )
        })}

        <div className="flex justify-start">
          <div className="flex max-w-[min(100%,520px)] flex-col items-start">
            <p className="mb-2 text-xl font-semibold text-slate-700">Sarah</p>
            <div className="flex items-end gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 via-zinc-50 to-stone-100 text-sm font-semibold text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                SA
              </div>
              <div className="rounded-[2rem] bg-slate-50 px-6 py-5 text-[1.02rem] italic text-slate-500 shadow-[0_18px_48px_rgba(15,23,42,0.04)]">
                Sarah is typing...
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
