import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "react-i18next";

const navLinks = [
  { to: "/", labelKey: "nav.home" },
  { to: "/report", labelKey: "nav.report" },
  { to: "/track", labelKey: "nav.track" },
  { to: "/map", labelKey: "nav.map" },
];

export function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      console.log('🔄 Navbar: Language changed to', lng, '- forcing re-render');
      setRenderKey(prev => prev + 1);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b" key={renderKey}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-lg text-primary">
          <Shield className="h-6 w-6" />
          CivicTrack AI
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === l.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {t(l.labelKey)}
            </Link>
          ))}
          
          {/* Language Selector - Desktop */}
          <LanguageSelector />
          {/** auth links */}
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link to="/admin">
                  <Button size="sm" variant="outline" className="ml-2">
                    {t("nav.admin")}
                  </Button>
                </Link>
              )}
              {["BBMP", "BWSSB", "BESOM"].includes(user.role) && (
                <Link to="/member">
                  <Button size="sm" variant="outline" className="ml-2">
                    {t("nav.dashboard")}
                  </Button>
                </Link>
              )}
              <Button size="sm" variant="link" className="ml-2" onClick={() => logout()}>
                {t("nav.logout")}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button size="sm" variant="outline" className="ml-2">
                  {t("nav.login")}
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" variant="outline" className="ml-2">
                  {t("nav.signup")}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-card px-4 pb-4 space-y-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === l.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {t(l.labelKey)}
            </Link>
          ))}
          
          {/* Language Selector Mobile */}
          <div className="px-3 py-2 border-t mt-2 pt-2">
            <LanguageSelector />
          </div>
          
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link to="/admin" onClick={() => setOpen(false)}>
                  <Button size="sm" variant="outline" className="w-full mt-2">
                    {t("nav.admin")}
                  </Button>
                </Link>
              )}
              {["BBMP", "BWSSB", "BESOM"].includes(user.role) && (
                <Link to="/member" onClick={() => setOpen(false)}>
                  <Button size="sm" variant="outline" className="w-full mt-2">
                    {t("nav.dashboard")}
                  </Button>
                </Link>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full mt-2" 
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
              >
                {t("nav.logout")}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                <Button size="sm" variant="outline" className="w-full mt-2">
                  {t("nav.login")}
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setOpen(false)}>
                <Button size="sm" variant="outline" className="w-full mt-2">
                  {t("nav.signup")}
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
