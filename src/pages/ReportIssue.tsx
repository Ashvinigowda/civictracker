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
import { motion, AnimatePresence } from "framer-motion";

export default function ReportIssue() {
  const [submitted, setSubmitted] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-16 relative">
        <div className="absolute top-0 right-10 w-72 h-72 bg-primary/10 blur-[100px] rounded-full -z-10"></div>
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-accent/10 blur-[120px] rounded-full -z-10"></div>
        
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl mx-auto flex flex-col items-center text-center gap-6 py-20"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="h-28 w-28 rounded-full bg-accent/10 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)]"
              >
                <CheckCircle2 className="h-14 w-14 text-accent" />
              </motion.div>
              <h1 className="text-4xl font-heading font-bold text-foreground">Issue Reported Successfully!</h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Your complaint has been registered with ID <strong className="text-primary bg-primary/10 px-2 py-1 rounded-md">CIV-1007</strong>. You can track its status on the tracking page.
              </p>
              <Button size="lg" className="mt-4 rounded-full shadow-lg hover:scale-105 transition-transform duration-300" onClick={() => {
                setSubmitted(false);
                setPreview(null);
              }}>
                Report Another Issue
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="mb-10 text-center">
                <h1 className="text-4xl font-heading font-bold mb-3 text-foreground">Report a Civic Issue</h1>
                <p className="text-lg text-muted-foreground">Fill in the details below to submit your complaint.</p>
              </div>

              <Card className="glass-panel border-0 shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-border/50 py-6">
                  <CardTitle className="text-xl font-heading flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    Issue Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  {/* Image upload */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-foreground">Upload Photo</Label>
                    <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group overflow-hidden">
                      {preview ? (
                        <motion.img 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          src={preview} 
                          alt="Preview" 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-muted-foreground group-hover:text-primary transition-colors">
                          <div className="p-4 bg-muted rounded-full group-hover:bg-primary/10 transition-colors">
                            <ImageIcon className="h-8 w-8" />
                          </div>
                          <span className="text-sm font-medium">Click to upload image</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  </div>

                  {/* Issue type */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-foreground">Issue Type</Label>
                    <Select>
                      <SelectTrigger className="h-12 rounded-xl bg-background/50 backdrop-blur-sm border-border focus:ring-primary focus:ring-offset-0">
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {(["Pothole", "Garbage", "Water Leak", "Streetlight Damage", "Other"] as IssueType[]).map((t) => (
                          <SelectItem key={t} value={t} className="rounded-lg">{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-foreground">Description</Label>
                    <Textarea 
                      placeholder="Describe the issue in detail..." 
                      rows={4} 
                      className="rounded-xl bg-background/50 backdrop-blur-sm border-border focus:ring-primary focus:ring-offset-0 resize-none"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-foreground">Location</Label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input 
                        placeholder="Enter address or landmark" 
                        className="pl-12 h-12 rounded-xl bg-background/50 backdrop-blur-sm border-border focus:ring-primary focus:ring-offset-0" 
                      />
                    </div>
                  </div>

                  {/* Map preview placeholder */}
                  <div className="h-40 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center border border-border/50">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <span className="text-sm font-medium">Map preview will appear here</span>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full h-14 text-lg rounded-xl shadow-lg hover:shadow-primary/25 hover:-translate-y-1 transition-all duration-300" 
                    onClick={() => setSubmitted(true)}
                  >
                    Submit Report
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
