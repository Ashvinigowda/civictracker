import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, MapPin, CheckCircle2, ImageIcon } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { IssueType } from "@/data/mockData";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
}

export default function ReportIssue() {
  const [submitted, setSubmitted] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [type, setType] = useState<IssueType | "">("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [lat, setLat] = useState(28.4595);
  const [lng, setLng] = useState(77.0266);
  const [isDetecting, setIsDetecting] = useState(false);

  // Get user's current location on mount
  useEffect(() => {
    console.log('🚀 Component mounted - NOT auto-detecting location on load');
    console.log('⏱️ User must click "📍 Use My Location" button to detect');
  }, []);

  const detectLocation = () => {
    console.log('▶️ detectLocation called');
    setIsDetecting(true);
    
    if (!navigator.geolocation) {
      console.error('❌ Geolocation API not available');
      alert('Your browser does not support geolocation');
      setIsDetecting(false);
      return;
    }
    
    console.log('📍 Requesting geolocation permission...');
    console.log('🌐 Current URL:', window.location.href);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log('✅ SUCCESS! Location detected:', latitude, longitude);
        console.log('📊 Accuracy:', accuracy, 'meters');
        setLat(latitude);
        setLng(longitude);
        setLocation(`📍 Your Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setIsDetecting(false);
      },
      (error) => {
        console.error('❌ Geolocation ERROR Code:', error.code);
        console.error('❌ Error message:', error.message);
        
        let errorMsg = 'Could not get location';
        if (error.code === 1) {
          errorMsg = 'Location access denied. Check browser permissions.';
        } else if (error.code === 2) {
          errorMsg = 'Location not available. Check your GPS/network.';
        } else if (error.code === 3) {
          errorMsg = 'Location request timed out.';
        }
        
        console.warn('⚠️ Error message for user:', errorMsg);
        alert(errorMsg);
        setIsDetecting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0
      }
    );
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDescriptionChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setDescription(newDescription);

    // Auto-classify description with AI
    if (newDescription.trim().length > 10) {
      console.log('🔍 Analyzing description with AI...', newDescription);
      setIsClassifying(true);

      try {
        console.log('📤 Sending to /api/classify-text...');
        const response = await fetch('/api/classify-text', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ description: newDescription }),
        });

        console.log('📥 Response status:', response.status);

        if (response.ok) {
          const result = await response.json();
          console.log('🤖 Classification result:', result);

          if (result.issue_type) {
            const detectedType = result.issue_type;
            console.log(`✅ Detected type: ${detectedType}`);
            
            if (detectedType !== 'Other') {
              setType(detectedType as IssueType);
              console.log(`✅ Auto-selected: ${detectedType} (confidence: ${result.confidence})`);
            } else {
              console.log('⚠️ Detected as "Other", not auto-selecting');
            }
          } else {
            console.warn('⚠️ No classification in response:', result);
          }
        } else {
          console.warn('⚠️ AI classification unavailable (status:', response.status, ')');
        }
      } catch (err) {
        console.warn('⚠️ AI service not available. You can select issue type manually.', err);
      } finally {
        setIsClassifying(false);
      }
    } else {
      setIsClassifying(false);
    }
  };

  const handleSubmit = async () => {
    if (!type || !description || !location) {
      alert('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('type', type);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('lat', lat.toString());
    formData.append('lng', lng.toString());
    if (imageFile) formData.append('image', imageFile);

    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setCreatedId(data.id || data._id);
        setSubmitted(true);
      } else {
        alert('Failed to submit issue');
      }
    } catch (err) {
      console.error('Error submitting issue:', err);
      alert('Error submitting issue');
    }
  };

  return (
    <Layout>
      {submitted ? (
        <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center gap-6">
          <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center animate-pulse">
            <CheckCircle2 className="h-10 w-10 text-accent" />
          </div>
          <h1 className="text-3xl font-heading font-bold">Issue Reported Successfully!</h1>
          <p className="text-muted-foreground max-w-md">
            Your complaint has been registered with ID <strong className="text-primary">{createdId || '‑'}</strong>. You can track its status on the tracking page.
          </p>
          <Button onClick={() => {
            setSubmitted(false);
            setType("");
            setDescription("");
            setLocation("");
            setImageFile(null);
            setPreview(null);
            setCreatedId(null);
          }} className="mt-4">
            Report Another Issue
          </Button>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-heading font-bold mb-2">Report a Civic Issue</h1>
            <p className="text-muted-foreground mb-8">Fill in the details below to submit your complaint.</p>

            <Card className="civic-card">
            <CardHeader>
                <CardTitle className="text-lg">Issue Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Image upload */}
                <div>
                  <Label className="mb-2 block">Upload Photo</Label>
                  <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors">
                    {preview ? (
                      <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <ImageIcon className="h-8 w-8" />
                        <span className="text-sm font-medium">Click to upload image</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>

                {/* Issue type */}
                <div>
                  <Label className="mb-2 block">Issue Type</Label>
                  <Select value={type} onValueChange={(v) => setType(v as IssueType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      {(["Pothole", "Garbage", "Water Leak", "Streetlight Damage", "Other"] as IssueType[]).map((tOpt) => (
                        <SelectItem key={tOpt} value={tOpt}>{tOpt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div>
                  <Label className="mb-2 block">Description</Label>
                  <Textarea
                    placeholder="Describe the issue in detail..."
                    rows={4}
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    💡 Type at least 10 characters. AI will automatically detect the issue type!
                  </p>
                  {isClassifying && (
                    <p className="text-sm text-civic-amber mt-1">
                      🤖 Analyzing your description...
                    </p>
                  )}
                  {type && type !== "" && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ Auto-detected: {type}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <Label className="mb-2 block">Location</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Location"
                        className="pl-9"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={detectLocation}
                      disabled={isDetecting}
                      className="px-4 whitespace-nowrap"
                    >
                      {isDetecting ? "Detecting..." : "Use My Location"}
                    </Button>
                  </div>
                </div>

                {/* Map */}
                <div>
                  <Label className="mb-2 block">Confirm Your Location on Map</Label>
                  <div style={{ height: "400px", borderRadius: "0.75rem", overflow: "hidden" }}>
                    <MapContainer
                      center={[lat, lng]}
                      zoom={15}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[lat, lng]}>
                        <Popup>
                          {location || "Location"}
                        </Popup>
                      </Marker>
                      <MapClickHandler onMapClick={(lat, lng) => {
                        setLat(lat);
                        setLng(lng);
                        setLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
                      }} />
                      <MapUpdater lat={lat} lng={lng} />
                    </MapContainer>
                  </div>
                </div>

                <Button type="button" onClick={handleSubmit} disabled={isClassifying} className="w-full mt-4">
                  {isClassifying ? "Detecting..." : "Submit Issue"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </Layout>
  );
}

