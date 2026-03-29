export default function LandingFooter() {
  return (
    <footer
      id="about"
      className="mx-auto flex max-w-7xl flex-col justify-between gap-4 border-t border-slate-200/80 px-6 py-8 text-sm text-slate-500 md:flex-row lg:px-8"
    >
      <div>
        <div className="font-semibold text-slate-700">Emotion AI</div>
        <div>Soft visuals. Clear hierarchy. Modern calm.</div>
      </div>
      <div>CopyRight: QuocBo- QuangHuy</div>
      <div className="flex flex-wrap gap-5">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms</a>
        <a href="#">Support</a>
        <a href="#">Contact</a>
      </div>
    </footer>
  )
}
