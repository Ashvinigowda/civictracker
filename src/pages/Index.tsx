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
import { getIssues } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

import { motion } from "framer-motion";

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
  const { data: issues = [] } = useQuery({
    queryKey: ['public-issues'],
    queryFn: () => getIssues()
  });

  const stats = [
    {
      label: "Total Reported",
      value: issues.length,
      icon: BarChart3,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Resolved",
      value: issues.filter((i) => i.status === "Resolved").length,
      icon: CheckCircle2,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "In Progress",
      value: issues.filter((i) => i.status === "In Progress" || i.status === "Assigned").length,
      icon: Clock,
      color: "text-civic-amber",
      bg: "bg-civic-amber/10",
    },
    {
      label: "Pending",
      value: issues.filter((i) => i.status === "Reported").length,
      icon: AlertTriangle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-background -z-20"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <h1 className="text-6xl md:text-8xl font-heading font-normal text-foreground leading-[1.1] mb-8 tracking-tighter">
                Report Civic <br />
                <span className="italic text-primary">Issues</span>.
              </h1>
              <p className="text-muted-foreground text-xl max-w-lg mb-10 leading-relaxed">
                Empowering citizens to report potholes, garbage, water leaks, and more — tracked transparently until resolved.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/report">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] hover:scale-105 transition-transform duration-300">
                    Report an Issue <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/track">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-border hover:bg-foreground hover:text-background hover:scale-105 transition-all duration-300">
                    Track Complaint
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden relative true-glass border border-white/5 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent mix-blend-overlay"></div>
                {/* Abstract visualization instead of generic cards */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-8 left-8 right-8 true-glass rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Camera className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Latest Report</div>
                      <div className="font-medium text-foreground">Pothole on 5th Ave</div>
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div className="bg-primary w-2/3 h-full rounded-full"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 border-y border-border/50">
        <div className="container mx-auto px-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-12"
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={itemVariants} className="flex flex-col border-l border-border/50 pl-6">
                <s.icon className={`h-6 w-6 ${s.color} mb-6`} />
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="text-5xl font-heading font-light text-foreground mb-2 tabular-nums tracking-tighter"
                >
                  {s.value}
                </motion.span>
                <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works - Zig Zag layout */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mb-24">
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Process</h2>
            <h3 className="text-5xl font-heading font-normal text-foreground tracking-tight leading-[1.1]">
              How It Works
            </h3>
          </div>
          
          <div className="space-y-32 max-w-5xl mx-auto">
            {steps.map((s, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={`flex flex-col gap-12 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
              >
                <div className="w-full md:w-1/2 aspect-square md:aspect-[4/3] rounded-[2rem] true-glass relative flex items-center justify-center overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500"></div>
                  <s.icon className="h-24 w-24 text-primary opacity-80 group-hover:scale-110 transition-transform duration-700 ease-out" />
                </div>
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 block">Step 0{i + 1}</span>
                  <h3 className="text-3xl font-heading font-medium text-foreground mb-4">{s.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
