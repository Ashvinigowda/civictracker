import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type CivicIssue } from "@/data/mockData";
import { getIssues } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { MapPin, X, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import { motion, AnimatePresence } from "framer-motion";

function getStatusConfig(status: string) {
  if (status === "Resolved") return { bg: "bg-accent", icon: CheckCircle2, text: "text-accent", border: "border-accent/30", bgLight: "bg-accent/10" };
  if (status === "In Progress" || status === "Assigned") return { bg: "bg-civic-amber", icon: Clock, text: "text-civic-amber", border: "border-civic-amber/30", bgLight: "bg-civic-amber/10" };
  return { bg: "bg-destructive", icon: AlertTriangle, text: "text-destructive", border: "border-destructive/30", bgLight: "bg-destructive/10" };
}

function StatusBadge({ status }: { status: string }) {
  const config = getStatusConfig(status);
  return <span className={`font-semibold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider ${config.bgLight} ${config.text}`}>{status}</span>;
}

export default function IssuesMap() {
  const [selected, setSelected] = useState<CivicIssue | null>(null);
  const center: [number, number] = [28.4595, 77.0266];

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ['issues-map'],
    queryFn: () => getIssues()
  });

  const createCustomIcon = (status: string) => {
    const config = getStatusConfig(status);
    const htmlString = `
      <div class="relative group cursor-pointer hover:scale-110 transition-transform">
        <div class="h-6 w-6 rounded-full ${config.bg} shadow-[0_0_15px_rgba(0,0,0,0.3)] border-2 border-white flex items-center justify-center relative z-10"></div>
        <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-black/40 blur-[2px] rounded-full"></div>
      </div>
    `;
    return divIcon({
      className: "custom-leaflet-icon bg-transparent border-0",
      html: htmlString,
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24],
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-24 min-h-[90vh]">
        <div className="mb-12 text-center lg:text-left">
          <h1 className="text-6xl font-heading font-normal mb-4 text-foreground tracking-tight">Public Issues <span className="italic text-primary">Map.</span></h1>
          <p className="text-xl text-muted-foreground">
            Explore reported civic issues in real-time. Click a marker to view detailed information.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-10 justify-center lg:justify-start">
          <div className="flex items-center gap-3 bg-background/50 px-5 py-3 rounded-full border border-border/50 shadow-sm"><span className="h-3 w-3 rounded-full bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.6)]" /> <span className="text-sm font-medium uppercase tracking-wider">Pending</span></div>
          <div className="flex items-center gap-3 bg-background/50 px-5 py-3 rounded-full border border-border/50 shadow-sm"><span className="h-3 w-3 rounded-full bg-civic-amber shadow-[0_0_10px_rgba(245,158,11,0.6)]" /> <span className="text-sm font-medium uppercase tracking-wider">In Progress</span></div>
          <div className="flex items-center gap-3 bg-background/50 px-5 py-3 rounded-full border border-border/50 shadow-sm"><span className="h-3 w-3 rounded-full bg-accent shadow-[0_0_10px_rgba(34,197,94,0.6)]" /> <span className="text-sm font-medium uppercase tracking-wider">Resolved</span></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 relative z-0">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-[2rem] h-[600px] overflow-hidden shadow-2xl border border-border/50 relative">
              <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} zoomControl={false}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                {issues.map((issue) => (
                  <Marker
                    key={issue.id}
                    position={[issue.lat || 0, issue.lng || 0]}
                    icon={createCustomIcon(issue.status)}
                    eventHandlers={{
                      click: () => setSelected(issue),
                    }}
                  >
                    <Popup className="rounded-xl overflow-hidden shadow-xl border-0">
                      <div className="font-heading font-medium text-base mb-1">{issue.type}</div>
                      <div className="text-xs text-muted-foreground mb-2 tracking-wider uppercase">{issue.id}</div>
                      <StatusBadge status={issue.status} />
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key="selected-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                >
                  <Card className="true-glass border-0 shadow-2xl rounded-[2rem] overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-border/20 p-6">
                      <CardTitle className="text-sm font-heading font-bold tracking-widest uppercase bg-primary/10 text-primary px-3 py-1 rounded-md">{selected.id}</CardTitle>
                      <button onClick={() => setSelected(null)} className="p-2 rounded-full hover:bg-black/5 transition-colors">
                        <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                      </button>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="relative rounded-2xl overflow-hidden group">
                        <img src={selected.image} alt={selected.type} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                          <span className="font-heading font-medium text-white text-2xl tracking-tight">{selected.type}</span>
                          <StatusBadge status={selected.status} />
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-4 rounded-xl">
                        <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" /> 
                        <span className="text-base font-medium leading-relaxed">{selected.location}</span>
                      </div>
                      
                      <div className="space-y-2 px-2">
                        <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Description</h4>
                        <p className="text-base text-foreground/80 leading-relaxed font-light">{selected.description}</p>
                      </div>
                      
                      <p className="text-xs font-semibold text-muted-foreground pt-6 border-t border-border/20 px-2 uppercase tracking-wider">
                        Reported on {selected.date}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="empty-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="true-glass border border-dashed border-border/50 shadow-none rounded-[2rem] h-full flex flex-col justify-center min-h-[350px]">
                    <CardContent className="p-8 text-center text-muted-foreground flex flex-col items-center gap-6">
                      <div className="p-5 bg-primary/5 rounded-full">
                        <MapPin className="h-10 w-10 text-primary/50" />
                      </div>
                      <p className="text-lg font-medium max-w-[200px] leading-relaxed">Click a marker on the map to view detailed issue information.</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <h4 className="font-heading font-medium text-xl mb-4 sticky top-0 bg-background/80 backdrop-blur-md py-3 z-10 border-b border-border/20">Recent Issues</h4>
              {isLoading && <p className="text-muted-foreground p-4">Loading issues...</p>}
              {issues.map((issue) => (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  key={issue.id}
                  onClick={() => setSelected(issue)}
                  className={`w-full text-left p-5 rounded-2xl border flex items-center gap-4 transition-all duration-300 ${
                    selected?.id === issue.id 
                      ? "bg-primary/5 border-primary shadow-md" 
                      : "bg-background/50 hover:bg-black/5 border-border/50 shadow-sm"
                  }`}
                >
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 ${getStatusConfig(issue.status).bgLight}`}>
                    <span className={`h-4 w-4 rounded-full ${getStatusConfig(issue.status).bg}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-heading font-medium truncate text-foreground text-lg">{issue.type}</div>
                    <div className="text-sm text-muted-foreground truncate mt-1">{issue.location}</div>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md uppercase tracking-wider">{issue.id}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
