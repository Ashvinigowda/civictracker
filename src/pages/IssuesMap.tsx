import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockIssues, type CivicIssue } from "@/data/mockData";
import { MapPin, X } from "lucide-react";

function StatusDot({ status }: { status: string }) {
  const color =
    status === "Resolved"
      ? "bg-accent"
      : status === "In Progress" || status === "Assigned"
      ? "bg-civic-amber"
      : "bg-destructive";
  return <span className={`inline-block h-3 w-3 rounded-full ${color}`} />;
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "Resolved"
      ? "civic-badge-resolved"
      : status === "In Progress" || status === "Assigned"
      ? "civic-badge-progress"
      : "civic-badge-pending";
  return <span className={cls}>{status}</span>;
}

export default function IssuesMap() {
  const [selected, setSelected] = useState<CivicIssue | null>(null);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-heading font-bold mb-2">Public Issues Map</h1>
        <p className="text-muted-foreground mb-6">
          View all reported civic issues. Click a marker for details.
        </p>

        {/* Legend */}
        <div className="flex gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-destructive" /> Pending</div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-civic-amber" /> In Progress</div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-accent" /> Resolved</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map placeholder */}
          <div className="lg:col-span-2">
            <div className="relative bg-muted rounded-xl h-[500px] overflow-hidden border">
              {/* Simulated map with positioned markers */}
              <div className="absolute inset-0 bg-gradient-to-br from-civic-light to-muted">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h40v40H0z\' fill=\'none\'/%3E%3Cpath d=\'M0 20h40M20 0v40\' stroke=\'%23000\' stroke-width=\'0.5\'/%3E%3C/svg%3E")' }} />
              </div>
              {mockIssues.map((issue, i) => {
                const top = 15 + (i % 3) * 25 + i * 5;
                const left = 10 + (i % 4) * 20 + i * 3;
                return (
                  <button
                    key={issue.id}
                    onClick={() => setSelected(issue)}
                    className="absolute z-10 group"
                    style={{ top: `${Math.min(top, 85)}%`, left: `${Math.min(left, 85)}%` }}
                  >
                    <div className="relative">
                      <StatusDot status={issue.status} />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border">
                        {issue.type}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details panel */}
          <div>
            {selected ? (
              <Card className="civic-card animate-fade-in">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{selected.id}</CardTitle>
                  <button onClick={() => setSelected(null)}>
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </CardHeader>
                <CardContent className="space-y-3">
                  <img src={selected.image} alt={selected.type} className="w-full h-36 object-cover rounded-lg" />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{selected.type}</span>
                    <StatusBadge status={selected.status} />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {selected.location}
                  </div>
                  <p className="text-sm text-muted-foreground">{selected.description}</p>
                  <p className="text-xs text-muted-foreground">Reported: {selected.date}</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="civic-card">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-3 text-primary/50" />
                  <p className="text-sm">Click a marker on the map to view issue details.</p>
                </CardContent>
              </Card>
            )}

            {/* Issue list */}
            <div className="mt-4 space-y-2">
              {mockIssues.map((issue) => (
                <button
                  key={issue.id}
                  onClick={() => setSelected(issue)}
                  className={`w-full text-left p-3 rounded-lg border text-sm flex items-center gap-3 transition-colors ${
                    selected?.id === issue.id ? "bg-primary/5 border-primary/30" : "hover:bg-muted"
                  }`}
                >
                  <StatusDot status={issue.status} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{issue.type}</div>
                    <div className="text-xs text-muted-foreground truncate">{issue.location}</div>
                  </div>
                  <span className="text-xs text-muted-foreground">{issue.id}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
