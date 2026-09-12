import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Lenis from "lenis";
import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * Global layout. Navbar is `fixed` (72px, glassmorphic — design.md 6.1),
 * so this component owns the top offset: the content slot gets pt-[72px].
 * Full-bleed heroes opt out inside the page (e.g. -mt-[72px] + own padding).
 * Page agents: do NOT add nav-height offsets in pages.
 */
export default function Layout() {
  const location = useLocation();

  // Lenis smooth scrolling (site-wide, design.md Section 5)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  // Scroll resets to top on route change (design.md Section 5)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-[100dvh] bg-ink-0 text-txt">
      <Navbar />
      <main className="pt-[72px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
