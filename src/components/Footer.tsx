import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-slate-50 dark:bg-slate-900 border-border">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-heading font-bold text-xl text-primary">
            <Shield className="h-6 w-6" />
            <span>CivicTrack AI</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            AI-powered civic issue reporting that connects citizens with local authorities for faster resolutions.
          </p>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-foreground mb-4">Quick Links</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link to="/report" className="hover:text-primary transition-colors">Report Issue</Link></li>
            <li><Link to="/track" className="hover:text-primary transition-colors">Track Complaint</Link></li>
            <li><Link to="/map" className="hover:text-primary transition-colors">Issues Map</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-foreground mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary/50" />
              Email: support@civictrack.ai
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary/50" />
              Helpline: 1800-CIVIC-00
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary/50" />
              Mon – Fri, 9 AM – 6 PM
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground bg-card/50">
        © 2026 CivicTrack AI. All rights reserved.
      </div>
    </footer>
  );
}
