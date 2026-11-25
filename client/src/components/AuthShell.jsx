export default function AuthShell({ children }) {
  return <div className="min-h-screen bg-white lg:grid lg:grid-cols-[1fr_1fr]">
    <aside className="relative hidden min-h-screen overflow-hidden bg-[#202f59] px-12 py-10 text-white lg:flex lg:flex-col">
      <div className="flex items-center gap-3 text-3xl font-semibold"><span className="h-12 w-12 rounded-full bg-brand"/>TaskFlow</div>
      <div className="relative z-10 my-auto max-w-lg pb-20">
        <h1 className="text-5xl font-semibold leading-tight">Plan smarter.<br/>Build better.</h1>
        <p className="mt-7 text-xl leading-9 text-indigo-100/80">A complete MERN application for projects, assignments and tasks.</p>
        <div className="mt-14 inline-flex rounded-full bg-indigo-500/40 px-5 py-3 font-semibold">B.Tech / BCA Practical Assignment</div>
      </div>
      <div className="pointer-events-none absolute -bottom-28 -left-24 h-96 w-[130%] -rotate-[31deg] border-t-[130px] border-[#111c39]"/>
      <div className="absolute bottom-10 left-12 flex gap-4 opacity-50">{Array.from({length:6}).map((_,i)=><span key={i} className="h-24 w-24 rounded-full border border-indigo-300"/>)}</div>
    </aside>
    <main className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-12"><div className="w-full max-w-xl">{children}</div></main>
  </div>;
}
