export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-20 border-t border-white/[0.06] px-8 md:px-16 py-8 backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-inter text-[12px] text-white/20">© {year} Bhaswati Sengupta. All rights reserved.</p>
        <p className="font-inter text-[12px] text-white/20">Rock × EDM Live Experience — India</p>
        <a href="#home" className="group font-inter text-[12px] text-white/25 hover:text-white transition-colors duration-300 flex items-center gap-2">
          Back to top <span className="group-hover:-translate-y-0.5 transition-transform duration-300 inline-block">↑</span>
        </a>
      </div>
    </footer>
  );
}
