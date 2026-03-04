import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, MapPin, CheckCircle2, ImageIcon } from "lucide-react";
import type { IssueType } from "@/data/mockData";

export default function ReportIssue() {
  const [submitted, setSubmitted] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  if (submitted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center gap-6">
          <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center animate-count-up">
            <CheckCircle2 className="h-10 w-10 text-accent" />
          </div>
          <h1 className="text-3xl font-heading font-bold">Issue Reported Successfully!</h1>
          <p className="text-muted-foreground max-w-md">
            Your complaint has been registered with ID <strong className="text-primary">CIV-1007</strong>. You can track its status on the tracking page.
          </p>
          <Button onClick={() => setSubmitted(false)}>Report Another Issue</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    {(["Pothole", "Garbage", "Water Leak", "Streetlight Damage", "Other"] as IssueType[]).map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <Label className="mb-2 block">Description</Label>
                <Textarea placeholder="Describe the issue in detail..." rows={4} />
              </div>

              {/* Location */}
              <div>
                <Label className="mb-2 block">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Enter address or landmark" className="pl-9" />
                </div>
              </div>

              {/* Map preview placeholder */}
              <div className="h-48 rounded-xl bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <span className="text-sm">Map preview will appear here</span>
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={() => setSubmitted(true)}>
                <Upload className="mr-2 h-4 w-4" /> Submit Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
