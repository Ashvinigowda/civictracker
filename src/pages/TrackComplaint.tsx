import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Tag, FileImage, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { mockIssues, type CivicIssue } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "Resolved"
      ? "bg-accent/10 text-accent"
      : status === "In Progress" || status === "Assigned"
      ? "bg-civic-amber/10 text-civic-amber"
      : "bg-destructive/10 text-destructive";
  return <span className={`font-semibold text-xs px-3 py-1.5 rounded-full ${cls}`}>{status}</span>;
}

function StatusTimeline({ status }: { status: string }) {
  const stages = [
    { label: "Reported", icon: AlertTriangle },
    { label: "In Progress", icon: Clock },
    { label: "Resolved", icon: CheckCircle2 }
  ];

  let currentStageIndex = 0;
  if (status === "In Progress" || status === "Assigned") currentStageIndex = 1;
  if (status === "Resolved") currentStageIndex = 2;

  return (
    <div className="relative py-6">
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-border/50 -translate-x-1/2 rounded-full"></div>
      
      <div className="space-y-8 relative">
        {stages.map((stage, i) => {
          const isCompleted = i <= currentStageIndex;
          const isCurrent = i === currentStageIndex;
          
          return (
            <motion.div 
              key={stage.label}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2, type: "spring" }}
              className={`flex items-center gap-6 md:justify-between ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="md:w-1/2 flex md:justify-end">
                {i % 2 === 0 && <span className="hidden md:block font-medium text-foreground">{stage.label}</span>}
              </div>
              
              <div className={`relative z-10 flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center border-4 border-card transition-colors duration-500 ${
                isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              } ${isCurrent ? 'shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-110' : ''}`}>
                <stage.icon className="h-5 w-5" />
              </div>
              
              <div className="md:w-1/2">
                <span className={`font-medium block md:hidden ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>{stage.label}</span>
                {i % 2 !== 0 && <span className="hidden md:block font-medium text-foreground">{stage.label}</span>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function TrackComplaint() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<CivicIssue | null | "not_found">(null);

  const handleSearch = () => {
    const found = mockIssues.find((i) => i.id.toLowerCase() === query.trim().toLowerCase());
    setResult(found || "not_found");
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-16 relative min-h-[80vh]">
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -z-10"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-civic-amber/10 blur-[100px] rounded-full -z-10"></div>
        
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-heading font-bold mb-4 text-foreground">Track Your Complaint</h1>
            <p className="text-lg text-muted-foreground">Enter your complaint ID to check its real-time resolution status.</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 mb-12 max-w-xl mx-auto"
          >
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="e.g. CIV-1001"
                className="pl-14 h-16 text-lg rounded-2xl bg-background/60 backdrop-blur-md border-border shadow-lg focus:ring-primary focus:ring-offset-0"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} className="h-16 px-8 rounded-2xl text-lg shadow-lg hover:shadow-primary/25 hover:-translate-y-1 transition-all duration-300">
              Track
            </Button>
          </motion.div>

          <AnimatePresence mode="wait">
            {result === "not_found" && (
              <motion.div 
                key="not_found"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="glass-panel border-destructive/30 rounded-3xl">
                  <CardContent className="p-8 text-center text-muted-foreground flex flex-col items-center gap-4">
                    <AlertTriangle className="h-12 w-12 text-destructive/50" />
                    <p className="text-lg">No complaint found with that ID. Please check and try again.</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {result && result !== "not_found" && (
              <motion.div 
                key="found"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="glass-panel rounded-3xl overflow-hidden shadow-xl border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 border-b border-border/50 p-6 md:px-8">
                    <CardTitle className="text-2xl font-heading flex items-center gap-3">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-lg tracking-wider">{result.id}</span>
                    </CardTitle>
                    <StatusBadge status={result.status} />
                  </CardHeader>
                  <CardContent className="p-6 md:p-8 space-y-10">
                    
                    <StatusTimeline status={result.status} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-muted/30 p-6 rounded-2xl border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-background rounded-xl shadow-sm"><Tag className="h-5 w-5 text-primary" /></div>
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Type</p>
                          <p className="font-medium">{result.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-background rounded-xl shadow-sm"><MapPin className="h-5 w-5 text-primary" /></div>
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Location</p>
                          <p className="font-medium line-clamp-1">{result.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-background rounded-xl shadow-sm"><Calendar className="h-5 w-5 text-primary" /></div>
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Reported On</p>
                          <p className="font-medium">{result.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-background rounded-xl shadow-sm"><FileImage className="h-5 w-5 text-primary" /></div>
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Attachment</p>
                          <p className="font-medium">1 Photo</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-heading font-semibold text-lg text-foreground">Description</h4>
                      <p className="text-base text-muted-foreground leading-relaxed">{result.description}</p>
                    </div>

                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="rounded-2xl overflow-hidden shadow-lg border border-border/50 group cursor-pointer"
                    >
                      <img
                        src={result.image}
                        alt={result.type}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
