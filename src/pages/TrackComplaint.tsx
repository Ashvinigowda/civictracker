import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Tag, FileImage } from "lucide-react";
import { mockIssues, type CivicIssue } from "@/data/mockData";

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "Resolved"
      ? "civic-badge-resolved"
      : status === "In Progress" || status === "Assigned"
      ? "civic-badge-progress"
      : "civic-badge-pending";
  return <span className={cls}>{status}</span>;
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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-heading font-bold mb-2">Track Your Complaint</h1>
          <p className="text-muted-foreground mb-8">Enter your complaint ID to check the current status.</p>

          <div className="flex gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="e.g. CIV-1001"
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>Check Status</Button>
          </div>

          {result === "not_found" && (
            <Card className="civic-card border-destructive/30">
              <CardContent className="p-6 text-center text-muted-foreground">
                No complaint found with that ID. Please check and try again.
              </CardContent>
            </Card>
          )}

          {result && result !== "not_found" && (
            <Card className="civic-card animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{result.id}</CardTitle>
                <StatusBadge status={result.status} />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{result.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{result.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{result.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileImage className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Image:</span>
                    <span className="font-medium">Attached</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{result.description}</p>

                <img
                  src={result.image}
                  alt={result.type}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
