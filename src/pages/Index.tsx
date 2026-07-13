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
import { motion } from "framer-motion";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

export default function Index() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-40">
        <div className="absolute inset-0 bg-slate-900/5 -z-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-70"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 blur-[100px] rounded-full -z-10 opacity-50"></div>
        
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-foreground mb-8 tracking-tight">
              Report Civic Issues <br />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">With Intelligence.</span>
            </h1>
            <p className="text-muted-foreground text-xl md:text-2xl max-w-2xl mx-auto mb-10">
              Empowering citizens to report potholes, garbage, water leaks, and more — tracked transparently until resolved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/report">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-[0_0_40px_-10px_rgba(37,99,235,0.6)] hover:scale-105 transition-transform duration-300">
                  Report an Issue <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/track">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-border hover:bg-muted hover:scale-105 transition-transform duration-300">
                  Track Complaint
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Process</h2>
            <h3 className="text-4xl font-heading font-bold text-foreground">How It Works</h3>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {steps.map((s, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="glass-panel text-center p-10 h-full group hover:-translate-y-2 transition-transform duration-300 rounded-3xl">
                  <CardContent className="p-0 flex flex-col items-center gap-6">
                    <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                      <s.icon className="h-10 w-10 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted px-3 py-1 rounded-full">Step {i + 1}</span>
                    <h3 className="text-xl font-heading font-semibold text-foreground">{s.title}</h3>
                    <p className="text-base text-muted-foreground">{s.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Impact</h2>
            <h3 className="text-4xl font-heading font-bold text-foreground">Platform Statistics</h3>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={itemVariants} className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
                <div className={`h-16 w-16 rounded-2xl ${s.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <s.icon className={`h-8 w-8 ${s.color}`} />
                </div>
                <motion.span 
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="text-4xl font-heading font-bold text-foreground mb-2"
                >
                  {s.value}
                </motion.span>
                <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
