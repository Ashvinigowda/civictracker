import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  return <span className={`font-semibold text-xs px-4 py-2 rounded-full uppercase tracking-wider ${cls}`}>{status}</span>;
}

function StatusTimeline({ status }: { status: string }) {
  const stages = [
    { label: "Reported", icon: AlertTriangle, desc: "Issue received and logged" },
    { label: "In Progress", icon: Clock, desc: "Assigned to department" },
    { label: "Resolved", icon: CheckCircle2, desc: "Fixed and verified" }
  ];

  let currentStageIndex = 0;
  if (status === "In Progress" || status === "Assigned") currentStageIndex = 1;
  if (status === "Resolved") currentStageIndex = 2;

  return (
    <div className="relative py-4 pl-4 border-l-2 border-border/50 ml-4 space-y-10">
      {stages.map((stage, i) => {
        const isCompleted = i <= currentStageIndex;
        const isCurrent = i === currentStageIndex;
        
        return (
          <motion.div 
            key={stage.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, type: "spring", bounce: 0.4 }}
            className={`relative flex items-start gap-6 group`}
          >
            <div className={`absolute -left-[35px] top-0 flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center border-4 border-background transition-all duration-500 ${
              isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            } ${isCurrent ? 'shadow-[0_0_0_4px_rgba(37,99,235,0.2)] scale-110' : ''}`}>
              <stage.icon className="h-4 w-4" />
            </div>
            
            <div className="pt-1">
              <span className={`font-heading text-lg font-medium block ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>{stage.label}</span>
              <span className={`text-sm block mt-1 ${isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>{stage.desc}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function TrackComplaint() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<CivicIssue | null | "not_found">(null);

  const handleSearch = () => {
    if (!query.trim()) return;
    const found = mockIssues.find((i) => i.id.toLowerCase() === query.trim().toLowerCase());
    setResult(found || "not_found");
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-24 min-h-[90vh]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Search Column */}
          <div className="lg:col-span-5 flex flex-col pt-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h1 className="text-6xl font-heading font-normal mb-6 text-foreground tracking-tight leading-[1.1]">
                Track Your <br />
                <span className="italic text-primary">Complaint.</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-12">
                Enter your unique complaint ID to see real-time status and department updates.
              </p>
              
              <div className="relative group mb-4">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="ID: e.g. CIV-1001"
                  className="pl-16 h-16 text-lg rounded-2xl bg-background/50 border-border/50 shadow-sm focus:ring-primary focus:ring-offset-0 transition-shadow"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} className="w-full h-16 rounded-2xl text-lg hover:-translate-y-1 transition-all duration-300 font-medium">
                Track Status
              </Button>
            </motion.div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!result && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  className="h-full min-h-[400px] flex items-center justify-center border border-dashed border-border/50 rounded-[2rem] bg-background/30"
                >
                  <div className="text-center text-muted-foreground flex flex-col items-center gap-4">
                    <div className="p-4 bg-muted/50 rounded-full">
                      <Search className="h-8 w-8 opacity-50" />
                    </div>
                    <p className="text-lg">Enter an ID to view details</p>
                  </div>
                </motion.div>
              )}

              {result === "not_found" && (
                <motion.div 
                  key="not_found"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                >
                  <Card className="true-glass border-0 rounded-[2rem] overflow-hidden">
                    <CardContent className="p-16 text-center text-muted-foreground flex flex-col items-center gap-6">
                      <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center">
                        <AlertTriangle className="h-10 w-10 text-destructive/80" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-heading font-medium text-foreground mb-2">No Record Found</h3>
                        <p className="text-lg text-muted-foreground max-w-sm">We couldn't locate a complaint with that ID. Please check the number and try again.</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {result && result !== "not_found" && (
                <motion.div 
                  key="found"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", bounce: 0, duration: 0.7 }}
                >
                  <Card className="true-glass border-0 rounded-[2rem] overflow-hidden">
                    <div className="p-10 border-b border-border/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      <div>
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest block mb-2">Complaint ID</span>
                        <h2 className="text-4xl font-heading font-medium tracking-tight text-foreground">{result.id}</h2>
                      </div>
                      <StatusBadge status={result.status} />
                    </div>
                    
                    <CardContent className="p-10 space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest block mb-8">Resolution Progress</span>
                          <StatusTimeline status={result.status} />
                        </div>
                        
                        <div className="space-y-8">
                          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest block mb-2">Issue Details</span>
                          
                          <div className="space-y-6">
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Category</p>
                              <p className="font-medium text-lg flex items-center gap-2"><Tag className="h-4 w-4 text-primary" /> {result.type}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Location</p>
                              <p className="font-medium text-lg flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {result.location}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Date Reported</p>
                              <p className="font-medium text-lg flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {result.date}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-border/20">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest block mb-4">Description</span>
                        <p className="text-xl text-foreground/80 leading-relaxed font-light">{result.description}</p>
                      </div>

                      <div className="pt-8 border-t border-border/20">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest block mb-4 flex items-center gap-2">
                          <FileImage className="h-4 w-4" /> Attached Evidence
                        </span>
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", bounce: 0.4 }}
                          className="rounded-[1.5rem] overflow-hidden border border-border/20 cursor-pointer"
                        >
                          <img
                            src={result.image}
                            alt={result.type}
                            className="w-full h-80 object-cover"
                          />
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
}
