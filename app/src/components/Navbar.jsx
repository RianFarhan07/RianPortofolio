import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sun,
  Moon,
  Home,
  User,
  FolderOpen,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        // hysteresis biar nggak flicker di sekitar threshold
        setIsScrolled((s) => (s ? y > 30 : y > 60));
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { title: "Home", path: "/", icon: Home },
    { title: "About", path: "/about", icon: User },
    { title: "Projects", path: "/projects", icon: FolderOpen },
    { title: "Certificates", path: "/certificates", icon: ShieldCheck },
    { title: "Contact", path: "/contact", icon: MessageSquare },
  ];

  return (
    <>
      <header className="hidden md:block fixed top-3 left-0 right-0 z-50 w-full px-4">
        <nav
          className="mx-auto flex items-center justify-between rounded-full px-6 py-2 border-0"
          style={{
            width: "100%",
            maxWidth: isScrolled ? 760 : 1200,
            backgroundColor: isScrolled
              ? isDark
                ? "rgba(17,24,39,0.9)"
                : "rgba(255,255,255,0.9)"
              : "transparent",
            backdropFilter: isScrolled ? "blur(10px)" : "none",
            WebkitBackdropFilter: isScrolled ? "blur(10px)" : "none",
            boxShadow: isScrolled ? "0 10px 30px -12px rgba(0,0,0,0.35)" : "none",
            transition:
              "max-width .45s cubic-bezier(.4,0,.2,1), background-color .35s ease, box-shadow .35s ease, backdrop-filter .35s ease",
            willChange: "max-width",
          }}
        >
          <Link to="/" className="text-xl font-bold">
            <span className="text-2xl font-bold bg-gradient-to-r from-[var(--ac)] to-[var(--ac-deep)] bg-clip-text text-transparent">
              Rian.dev
            </span>
          </Link>

          {/* Desktop */}
          <div className="flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.title}
                  to={link.path}
                  className={`relative px-2 py-1 transition-colors ${
                    isActive
                      ? "text-[var(--ac)] font-semibold"
                      : isDark
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {link.title}
                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-1 h-1.5 w-1.5 bg-[var(--ac)] rounded-full mx-auto"></span>
                  )}
                </Link>
              );
            })}

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile  */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 ${
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        } border-t shadow-lg border-0`}
        style={{
          borderTopWidth: "1px",
          borderTopColor: isDark ? "#374151" : "#e5e7eb",
          borderLeft: 0,
          borderRight: 0,
          borderBottom: 0,
        }}
      >
        <div className="flex justify-around items-center py-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;

            return (
              <Link
                key={link.title}
                to={link.path}
                className={`flex flex-col items-center py-1 px-3 ${
                  isActive
                    ? "text-[var(--ac)]"
                    : isDark
                    ? "text-gray-400"
                    : "text-gray-600"
                }`}
              >
                <Icon size={16} />
                <span className="text-xs mt-1">{link.title}</span>
                {isActive && (
                  <span className="h-1 w-1 bg-[var(--ac)] rounded-full mt-1"></span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Floating Theme di mobile */}
      <button
        onClick={toggleTheme}
        className={`md:hidden fixed bottom-20 right-4 z-50 p-3 rounded-full shadow-lg ${
          isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
        }`}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </>
  );
}
