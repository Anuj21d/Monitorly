import { ChevronDown, ChevronUp, House, LogOut } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [navDiv, setNavDiv] = useState(false);
  return (
    <header className="w-full h-20 bg-canvas border-b border-white/8 sticky top-0 z-40 select-none">
      <div className="max-w-7xl mx-auto h-full px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-10 font-display">
          <div className="flex items-center font-extrabold tracking-[-0.03em] text-xl leading-none text-text-light-primary font-display gap-1">
            Monitor
            <span className="text-[#FF5A5F]">Pulse</span>
          </div>
          <nav className="hidden sm:flex items-center gap-2">
            <button className="px-3.5 py-1.5 font-body rounded-lg text-sm font-semibold transition-all text-[#FF5A5F] bg-card-elevated border border-white/8">
              Dashboard
            </button>
          </nav>
        </div>
        <div className="relative">
          <button
            onClick={() => {
              navDiv ? setNavDiv(false) : setNavDiv(true);
            }}
            className="flex items-center gap-3 p-1.5 pr-2.5 font-mono rounded-xl hover:bg-card-elevated border border-transparent hover:border-white/8 transition-all text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-card-elevated border border-white/15 flex items-center justify-center text-xs font-bold text-[#F5F3EE]">
              A
            </div>
            <span className="text-sm font-medium text-[#F5F3EE] hidden sm:inline">
              Anuj
            </span>

            {!navDiv ? (
              <ChevronDown size={16} strokeWidth={1.5} />
            ) : (
              <ChevronUp size={16} strokeWidth={1.5} />
            )}
          </button>
          {navDiv && (
            <div className="absolute right-0 mt-2 w-56 p-1.5 rounded-2xl bg-card-elevated border border-white/12 shadow-2xl space-y-1 text-xs z-50 animate-fadeIn font-sans">
              <div className="px-3 py-2 border-b border-white/8 mb-1">
                <div className="font-semibold text-[#F5F3EE]">
                  Anuj Dandavate
                </div>
                <div className="text-[11px] font-mono text-neutral truncate">
                  anujwork2410@gmail.com
                </div>
              </div>

              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#F5F3EE] hover:bg-white/6 transition-colors">
                <House size={16} strokeWidth={1.5} />
                <span>View Landing Page</span>
              </button>
              <div className="border-t border-white/8 my-1"></div>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-coral hover:bg-[#FF5A5F]/10 transition-colors">
                <LogOut size={16} strokeWidth={1.5} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
