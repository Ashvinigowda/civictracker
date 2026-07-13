import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-heading font-bold text-lg text-primary mb-3">
            <Shield className="h-5 w-5" />
            CivicTrack AI
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            AI-powered civic issue reporting that connects citizens with local authorities for faster resolutions.
          </p>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link to="/report" className="hover:text-primary transition-colors">Report Issue</Link></li>
            <li><Link to="/track" className="hover:text-primary transition-colors">Track Complaint</Link></li>
            <li><Link to="/map" className="hover:text-primary transition-colors">Issues Map</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Email: support@civictrack.ai</li>
            <li>Helpline: 1800-CIVIC-00</li>
            <li>Mon – Fri, 9 AM – 6 PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © 2026 CivicTrack AI. All rights reserved.
      </div>
    </footer>
  );
}
