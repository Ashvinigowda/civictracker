import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, MapPin, CheckCircle2, ImageIcon, Loader2 } from "lucide-react";
import type { IssueType } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { reportIssue } from "@/lib/api";
import { toast } from "sonner";

export default function ReportIssue() {
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [type, setType] = useState<IssueType | "">("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [isDetecting, setIsDetecting] = useState(false);
  const [aiConfidence, setAiConfidence] = useState<number | null>(null);

  const reportMutation = useMutation({
    mutationFn: (formData: FormData) => reportIssue(formData),
    onSuccess: (data) => {
      setSubmittedId(data.id);
      toast.success("Issue reported successfully!");
    },
    onError: (err) => {
      toast.error("Failed to report issue");
      console.error(err);
    }
  });

  const handleSubmit = () => {
    if (!type || !location || !description) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const formData = new FormData();
    formData.append("type", type);
    formData.append("location", location);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    reportMutation.mutate(formData);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      
      // Auto-detect with YOLO
      setIsDetecting(true);
      setAiConfidence(null);
      const formData = new FormData();
      formData.append('image', file);
      
      try {
        const response = await fetch('/api/yolo/classify', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.issue_type && data.issue_type !== 'Other') {
            setType(data.issue_type as IssueType);
            setAiConfidence(data.confidence);
            toast.success(`AI Vision detected: ${data.issue_type}`);
          }
        }
      } catch (err) {
        console.error("YOLO auto-classify failed:", err);
      } finally {
        setIsDetecting(false);
      }
    }
  };

  const getSafeUrl = (url: string | null) => {
    if (!url) return undefined;
    try {
      const parsed = new URL(url, window.location.origin);
      if (parsed.protocol === 'blob:' || parsed.protocol === 'data:') {
        return parsed.href;
      }
    } catch (e) {
      return undefined;
    }
    return undefined;
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-24 relative">
        <AnimatePresence mode="wait">
          {submittedId ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="max-w-2xl mx-auto flex flex-col items-center text-center gap-8 py-20 true-glass rounded-[2rem] p-12"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
                className="h-32 w-32 rounded-full bg-accent/10 flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.2)]"
              >
                <CheckCircle2 className="h-16 w-16 text-accent" />
              </motion.div>
              <h1 className="text-5xl font-heading font-medium text-foreground tracking-tight">Issue Reported</h1>
              <p className="text-xl text-muted-foreground max-w-md leading-relaxed">
                Your complaint is registered under ID <strong className="text-foreground border-b border-foreground/30 font-medium">{submittedId}</strong>.
              </p>
              <Button size="lg" className="mt-8 rounded-full hover:scale-105 transition-transform duration-300" onClick={() => {
                setSubmittedId(null);
                setPreview(null);
                setImageFile(null);
                setType("");
                setLocation("");
                setDescription("");
              }}>
                Report Another
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", bounce: 0, duration: 0.7 }}
              className="max-w-3xl mx-auto"
            >
              <div className="mb-12 text-center md:text-left">
                <h1 className="text-5xl md:text-6xl font-heading font-normal mb-4 text-foreground tracking-tight">Report a Civic Issue</h1>
                <p className="text-xl text-muted-foreground">Fill in the details below to submit your complaint.</p>
              </div>

              <Card className="true-glass border-0 shadow-2xl rounded-[2rem] overflow-hidden relative">
                <div className="absolute inset-0 bg-background/40 mix-blend-overlay -z-10"></div>
                <CardHeader className="border-b border-border/20 py-8 px-10">
                  <CardTitle className="text-2xl font-heading flex items-center gap-3 font-normal">
                    <Upload className="h-6 w-6 text-primary" />
                    Issue Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-10 p-10">
                  {/* Image upload */}
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold text-foreground uppercase tracking-wider">Photo Evidence</Label>
                    <label className="flex flex-col items-center justify-center h-56 border border-border/50 bg-background/30 rounded-2xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group overflow-hidden relative">
                      {preview ? (
                        <motion.img 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          src={getSafeUrl(preview)}
                          alt="Preview"
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-4 text-muted-foreground group-hover:text-primary transition-colors z-10">
                          <div className="p-5 bg-muted/50 rounded-full group-hover:bg-primary/10 transition-colors">
                            <ImageIcon className="h-8 w-8" />
                          </div>
                          <span className="text-sm font-medium">Click to upload image</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Issue type */}
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                        Category
                        {isDetecting && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
                        {aiConfidence && (
                          <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            AI Detected ({Math.round(aiConfidence * 100)}%)
                          </span>
                        )}
                      </Label>
                      <Select value={type} onValueChange={(val) => setType(val as IssueType)}>
                        <SelectTrigger className="h-14 rounded-xl bg-background/50 border-border/50 focus:ring-primary focus:ring-offset-0 text-base">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {(["Pothole", "Garbage", "Water Leak", "Streetlight Damage", "Other"] as IssueType[]).map((t) => (
                            <SelectItem key={t} value={t} className="rounded-lg">{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Location */}
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold text-foreground uppercase tracking-wider">Location</Label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Address or landmark" 
                          className="pl-12 h-14 rounded-xl bg-background/50 border-border/50 focus:ring-primary focus:ring-offset-0 text-base" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold text-foreground uppercase tracking-wider">Description</Label>
                    <Textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add specific details..." 
                      rows={5} 
                      className="rounded-xl bg-background/50 border-border/50 focus:ring-primary focus:ring-offset-0 resize-none text-base p-4"
                    />
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full h-16 text-lg rounded-xl shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 font-medium tracking-wide mt-4" 
                    onClick={handleSubmit}
                    disabled={reportMutation.isPending}
                  >
                    {reportMutation.isPending ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</> : "Submit Report"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
