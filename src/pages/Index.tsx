import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import {
  Camera,
  Cpu,
  CheckCircle2,
  BarChart3,
  Clock,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { mockIssues } from "@/data/mockData";

const stats = [
  {
    label: "Total Reported",
    value: mockIssues.length,
    icon: BarChart3,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Resolved",
    value: mockIssues.filter((i) => i.status === "Resolved").length,
    icon: CheckCircle2,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    label: "In Progress",
    value: mockIssues.filter((i) => i.status === "In Progress" || i.status === "Assigned").length,
    icon: Clock,
    color: "text-civic-amber",
    bg: "bg-civic-amber/10",
  },
  {
    label: "Pending",
    value: mockIssues.filter((i) => i.status === "Reported").length,
    icon: AlertTriangle,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
];

const steps = [
  { icon: Camera, title: "Upload Photo", desc: "Snap a photo of the civic issue you've spotted." },
  { icon: Cpu, title: "System Detects Issue", desc: "AI analyzes and categorizes the problem automatically." },
  { icon: CheckCircle2, title: "Authorities Resolve It", desc: "The issue is assigned and tracked until resolved." },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero */}
      <section className="civic-gradient py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-primary-foreground mb-6 animate-fade-in">
            Report Civic Issues Easily
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Empowering citizens to report potholes, garbage, water leaks, and more — tracked transparently until resolved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Link to="/report">
              <Button size="lg" variant="hero" className="text-base px-8">
                Report an Issue <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/track">
              <Button size="lg" variant="outline" className="text-base px-8 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                Track Complaint
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <Card key={i} className="civic-card text-center p-8 group">
                <CardContent className="p-0 flex flex-col items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <s.icon className="h-8 w-8 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Step {i + 1}</span>
                  <h3 className="text-lg font-heading font-semibold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Platform Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="stat-card items-center text-center">
                <div className={`h-12 w-12 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`h-6 w-6 ${s.color}`} />
                </div>
                <span className="text-3xl font-heading font-bold animate-count-up">{s.value}</span>
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
