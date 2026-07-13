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
      <div className="container mx-auto px-6 py-24 relative">
        <AnimatePresence mode="wait">
          {submitted ? (
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
                Your complaint is registered under ID <strong className="text-foreground border-b border-foreground/30 font-medium">CIV-1007</strong>.
              </p>
              <Button size="lg" className="mt-8 rounded-full hover:scale-105 transition-transform duration-300" onClick={() => {
                setSubmitted(false);
                setPreview(null);
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
                          src={preview} 
                          alt="Preview" 
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
                      <Label className="text-sm font-semibold text-foreground uppercase tracking-wider">Category</Label>
                      <Select>
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
                      placeholder="Add specific details..." 
                      rows={5} 
                      className="rounded-xl bg-background/50 border-border/50 focus:ring-primary focus:ring-offset-0 resize-none text-base p-4"
                    />
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full h-16 text-lg rounded-xl shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 font-medium tracking-wide mt-4" 
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
