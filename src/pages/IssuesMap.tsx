import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockIssues, type CivicIssue } from "@/data/mockData";
import { getIssues } from "@/lib/api";
import { MapPin, X } from "lucide-react";

// leaflet imports for realistic map
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// fix default icon paths so markers render correctly
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

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
  const [issues, setIssues] = useState<CivicIssue[]>(mockIssues);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLat, setUserLat] = useState(28.4595); // Default to Delhi
  const [userLng, setUserLng] = useState(77.0266);
  const [locationLoading, setLocationLoading] = useState(true);

  // Detect user's current location
  useEffect(() => {
    const detectUserLocation = () => {
      if (!navigator.geolocation) {
        console.warn("Geolocation API not available, using default location");
        setLocationLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("✅ User location detected:", latitude, longitude);
          setUserLat(latitude);
          setUserLng(longitude);
          setLocationLoading(false);
        },
        (error) => {
          console.warn("⚠️ Could not detect location, using default:", error.message);
          setLocationLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    detectUserLocation();
  }, []);

  useEffect(() => {
    async function loadIssues() {
      try {
        console.log("Loading issues from API...");
        const data = await getIssues();
        console.log("API response:", data);
        if (data && data.length > 0) {
          setIssues(data);
        } else {
          console.log("No data from API, using mock data");
          setIssues(mockIssues);
        }
      } catch (err) {
        console.error("Failed to load issues:", err);
        setError(String(err));
        // still use mock data as fallback
        setIssues(mockIssues);
      } finally {
        setLoading(false);
      }
    }
    loadIssues();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-heading font-bold mb-2">Public Issues Map</h1>
        <p className="text-muted-foreground mb-6">
          View all reported civic issues. Click a marker for details.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Legend */}
        <div className="flex gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-destructive" /> Pending</div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-civic-amber" /> In Progress</div>
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-accent" /> Resolved</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map with real tiles */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="h-[500px] rounded-xl border overflow-hidden bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">Loading map...</p>
              </div>
            ) : (
              <div className="h-[500px] rounded-xl border overflow-hidden">
                <MapContainer
                  center={[userLat, userLng]}
                  zoom={14}
                  scrollWheelZoom={true}
                  className="h-full w-full"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                  {issues.map((issue) => (
                    <Marker
                      key={issue.id}
                      position={[issue.lat, issue.lng]}
                      eventHandlers={{
                        click: () => setSelected(issue),
                      }}
                    >
                      <Popup>{issue.type}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            )}
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
                  {selected.resolutionImage && (
                    <img src={selected.resolutionImage} alt="Resolved" className="w-full h-36 object-cover rounded-lg mt-2" />
                  )}
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
              {issues.map((issue) => (
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
