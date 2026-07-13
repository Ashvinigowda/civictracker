import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/report", label: "Report Issue" },
  { to: "/track", label: "Track Complaint" },
  { to: "/map", label: "Issues Map" },
];

export function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-4 z-50 mx-4 lg:mx-auto w-[96%] max-w-[90rem] glass-panel rounded-3xl mb-6">
      <div className="flex items-center justify-between h-[5rem] px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl text-primary hover:scale-105 transition-transform duration-300 md:-ml-2">
          <Shield className="h-6 w-6" />
          <span>CivicTrack AI</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((l) => {
            const isActive = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </Link>
            );
          })}
          <Link to="/admin">
            <Button size="sm" variant="outline" className="ml-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
              Admin
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-white/10 px-4 py-4 space-y-2 rounded-b-2xl"
        >
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === l.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-white/5"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/admin" onClick={() => setOpen(false)}>
            <Button size="sm" variant="outline" className="w-full mt-2 rounded-xl">
              Admin
            </Button>
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
