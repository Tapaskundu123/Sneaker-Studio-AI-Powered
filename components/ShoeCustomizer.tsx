"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Download,
  RotateCcw,
  Shuffle,
  Sparkles,
  Check,
  Wand2,
  Loader2,
  X,
} from "lucide-react";

interface AISuggestion {
  styleName: string;
  description: string;
  colors: { upper: string; accent: string; sole: string };
  material: string;
  textSuggestion: string;
  textColor: string;
  reasoning: string;
}

// Static fallback products (SVGs)
const products = [
  {
    id: "air-max-90",
    name: "Air Max 90",
    baseImage:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f8f8f8' width='400' height='300'/%3E%3Cpath d='M70 120 Q100 80 180 95 Q260 110 330 105 L330 200 Q260 210 180 190 Q100 170 70 200 Z' fill='%23e0e0e0'/%3E%3Cellipse cx='120' cy='180' rx='25' ry='15' fill='%23999'/%3E%3Cellipse cx='280' cy='185' rx='25' ry='15' fill='%23999'/%3E%3Cpath d='M90 130 L310 140 L310 165 L90 155 Z' fill='%23ccc'/%3E%3C/svg%3E",
    options: { materials: ["canvas", "leather", "suede", "mesh"] },
  },
  {
    id: "jordan-1",
    name: "Jordan 1",
    baseImage:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f8f8f8' width='400' height='300'/%3E%3Cpath d='M60 110 Q95 70 175 85 Q255 100 340 95 L340 210 Q255 220 175 200 Q95 180 60 210 Z' fill='%23e0e0e0'/%3E%3Cpath d='M80 120 L320 130 L320 145 L80 135 Z' fill='%23d0d0d0'/%3E%3Cellipse cx='115' cy='190' rx='30' ry='18' fill='%23888'/%3E%3Cellipse cx='285' cy='195' rx='30' ry='18' fill='%23888'/%3E%3Cpath d='M100 95 Q180 85 300 100' stroke='%23aaa' stroke-width='3' fill='none'/%3E%3C/svg%3E",
    options: { materials: ["canvas", "leather", "suede", "patent"] },
  },
  {
    id: "dunk-low",
    name: "Dunk Low",
    baseImage:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f8f8f8' width='400' height='300'/%3E%3Cpath d='M75 125 Q105 85 185 100 Q265 115 325 110 L325 195 Q265 205 185 185 Q105 165 75 195 Z' fill='%23e5e5e5'/%3E%3Cpath d='M95 135 L305 142 L305 158 L95 150 Z' fill='%23d5d5d5'/%3E%3Cellipse cx='125' cy='175' rx='22' ry='13' fill='%23999'/%3E%3Cellipse cx='275' cy='178' rx='22' ry='13' fill='%23999'/%3E%3Cpath d='M110 110 L290 118' stroke='%23bbb' stroke-width='2.5' fill='none'/%3E%3C/svg%3E",
    options: { materials: ["canvas", "leather", "nubuck"] },
  },
];

const colorPresets = [
  { name: "Classic White", color: "#FFFFFF", vibe: "clean, minimal" },
  { name: "Midnight Black", color: "#000000", vibe: "sleek, elegant" },
  { name: "Electric Blue", color: "#0066FF", vibe: "bold, sporty" },
  { name: "Crimson Red", color: "#DC143C", vibe: "fierce, energetic" },
  { name: "Sunset Orange", color: "#FF6B35", vibe: "warm, vibrant" },
  { name: "Forest Green", color: "#228B22", vibe: "nature, calm" },
  { name: "Royal Purple", color: "#6A0DAD", vibe: "luxury, creative" },
  { name: "Gold Rush", color: "#FFD700", vibe: "premium, eye-catching" },
  { name: "Navy Blue", color: "#001F3F", vibe: "classic, sophisticated" },
  { name: "Hot Pink", color: "#FF1493", vibe: "playful, bold" },
  { name: "Neon Green", color: "#39FF14", vibe: "edgy, modern" },
  { name: "Burgundy", color: "#800020", vibe: "rich, refined" },
];

const quickPrompts = [
  "Summer beach vibes",
  "Retro 80s style",
  "Professional business look",
  "Sporty and bold",
  "Minimalist aesthetic",
  "Streetwear culture",
];

const adjustBrightness = (color: string, percent: number) => {
  const num = parseInt(color.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
};

// Props: id + optional Cloudinary URL
type Props = {
  id: string;
  cloudinaryUrl?: string; // From MongoDB
};

export default function AIShoeCustomizer({ id, cloudinaryUrl }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedProduct, setSelectedProduct] = useState<string>(() => {
    return products.find((p) => p.id === id)?.id || products[0].id;
  });

  const [custom, setCustom] = useState({
    upper: { color: "#FFFFFF", material: "canvas" },
    accent: { color: "#000000" },
    sole: { color: "#FFFFFF" },
    text: "",
    textSize: 20,
    textColor: "#000000",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [conversationHistory] = useState<any[]>([]);

  // Sync with URL id
  useEffect(() => {
    const found = products.find((p) => p.id === id);
    if (found) setSelectedProduct(found.id);
  }, [id]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cWidth = 900;
    const cHeight = 675;
    canvas.width = cWidth;
    canvas.height = cHeight;
    ctx.clearRect(0, 0, cWidth, cHeight);

    const baseImg = new Image();

    // Use Cloudinary URL if provided, else fallback to static SVG
    const imageSrc = cloudinaryUrl || products.find(p => p.id === selectedProduct)?.baseImage;

    if (!imageSrc) {
      console.error("No image source available");
      return;
    }

    baseImg.onload = () => {
      try {
        ctx.drawImage(baseImg, 0, 0, cWidth, cHeight);

        // Upper gradient
        const upperGradient = ctx.createLinearGradient(128, 96, cWidth - 256, cHeight - 264);
        upperGradient.addColorStop(0, custom.upper.color);
        upperGradient.addColorStop(1, adjustBrightness(custom.upper.color, -15));
        ctx.fillStyle = upperGradient;
        ctx.globalAlpha = custom.upper.material === "leather" ? 0.88 : 0.92;
        ctx.fillRect(128, 96, cWidth - 256, 240);
        ctx.globalAlpha = 1;

        // Accent
        ctx.fillStyle = custom.accent.color;
        ctx.fillRect(152, 216, cWidth - 304, 37);

        // Sole
        ctx.fillStyle = custom.sole.color;
        ctx.fillRect(112, 312, cWidth - 224, 40);

        // Shine
        const shine = ctx.createLinearGradient(160, 112, cWidth - 192, 160);
        shine.addColorStop(0, "rgba(255,255,255,0)");
        shine.addColorStop(0.5, "rgba(255,255,255,0.4)");
        shine.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = shine;
        ctx.fillRect(160, 112, cWidth - 320, 64);

        // Text
        if (custom.text) {
          ctx.fillStyle = custom.textColor;
          ctx.font = `bold ${custom.textSize * 1.5}px 'Arial Black', sans-serif`;
          ctx.textAlign = "center";
          ctx.shadowColor = "rgba(0,0,0,0.4)";
          ctx.shadowBlur = 9;
          ctx.shadowOffsetX = 3;
          ctx.shadowOffsetY = 3;
          ctx.fillText(custom.text, cWidth / 2, 224);
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        }
      } catch (err) {
        console.error("Drawing error:", err);
      }
    };

    baseImg.onerror = () => {
      console.error("Image failed to load:", imageSrc);
    };

    // Set crossOrigin only for external URLs
    if (cloudinaryUrl) {
      baseImg.crossOrigin = "anonymous";
    }

    baseImg.src = imageSrc;

    return () => {
      baseImg.onload = null;
      baseImg.onerror = null;
    };
  }, [custom, selectedProduct, cloudinaryUrl]);

  const handleRandom = () => {
    const rand = (i: number) => colorPresets[Math.floor(Math.random() * colorPresets.length)];
    setCustom(c => ({
      ...c,
      upper: { ...c.upper, color: rand(0).color },
      accent: { color: rand(1).color },
      sole: { color: rand(2).color },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(res => setTimeout(res, 1200));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2400);
  };

  const handleAIRequest = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiError(null);

    try {
      const product = products.find(p => p.id === selectedProduct);
      const response = await fetch("/api/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: aiPrompt, selectedProduct: product }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const { suggestion } = await response.json();

      if (!suggestion?.styleName || !suggestion.colors?.upper) {
        throw new Error("Invalid AI response");
      }

      setAiSuggestion(suggestion);
      setAiPrompt("");
    } catch (err: any) {
      setAiError(err.message.includes("Invalid") ? "AI format error. Try again." : "AI unreachable.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const applyAISuggestion = () => {
    if (!aiSuggestion) return;
    setCustom({
      upper: { color: aiSuggestion.colors.upper, material: aiSuggestion.material },
      accent: { color: aiSuggestion.colors.accent },
      sole: { color: aiSuggestion.colors.sole },
      text: aiSuggestion.textSuggestion || "",
      textSize: custom.textSize,
      textColor: aiSuggestion.textColor || "#000000",
    });
    setAiSuggestion(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1600);
  };

  const product = products.find(p => p.id === selectedProduct);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100">
      {/* Header */}
      <motion.header initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Nike Studio Pro
              </h1>
              <p className="text-xs text-gray-600">AI-Powered Design</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
              <Wand2 className="h-3 w-3" /> AI Active
            </Badge>
            <Button variant="outline" size="sm">Gallery</Button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[380px_1fr] gap-8">

          {/* LEFT: Controls */}
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">

            {/* AI Assistant */}
            <Card className="shadow-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wand2 className="h-5 w-5" /> AI Design Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <Textarea
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  placeholder="e.g., 'Summer beach vibe with turquoise'"
                  className="resize-none h-24"
                  onKeyDown={e => e.key === "Enter" && e.ctrlKey && handleAIRequest()}
                />
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.slice(0, 3).map(p => (
                    <Badge key={p} variant="outline" className="cursor-pointer text-xs" onClick={() => setAiPrompt(p)}>
                      {p}
                    </Badge>
                  ))}
                </div>
                <Button onClick={handleAIRequest} disabled={isAiLoading || !aiPrompt.trim()} className="w-full bg-gradient-to-r from-orange-500 to-red-500">
                  {isAiLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Thinking...</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate</>}
                </Button>
                {aiError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{aiError}</div>}
              </CardContent>
            </Card>

            {/* Manual Controls */}
            <Card className="shadow-xl bg-white/90 backdrop-blur">
              <CardHeader><CardTitle className="text-xl">Manual Controls</CardTitle></CardHeader>
              <CardContent className="space-y-5">

                <div>
                  <label className="text-sm font-medium block mb-2">Model</label>
                  <Tabs value={selectedProduct} onValueChange={setSelectedProduct}>
                    <TabsList className="grid w-full grid-cols-3">
                      {products.map(p => (
                        <TabsTrigger key={p.id} value={p.id} className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                          {p.name.split(" ")[0]}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-3">Upper Color</label>
                  <div className="grid grid-cols-6 gap-2 mb-3">
                    {colorPresets.slice(0, 12).map(p => (
                      <motion.button
                        key={p.color}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCustom(c => ({ ...c, upper: { ...c.upper, color: p.color } }))}
                        className="h-10 rounded-lg shadow-md border-2"
                        style={{ backgroundColor: p.color, borderColor: custom.upper.color === p.color ? "#f97316" : "transparent" }}
                      >
                        {custom.upper.color === p.color && <Check className="h-4 w-4 text-white drop-shadow-lg absolute inset-0 m-auto" />}
                      </motion.button>
                    ))}
                  </div>
                  <Input type="color" value={custom.upper.color} onChange={e => setCustom(c => ({ ...c, upper: { ...c.upper, color: e.target.value } }))} className="h-10 w-full" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium block mb-2">Accent</label><Input type="color" value={custom.accent.color} onChange={e => setCustom(c => ({ ...c, accent: { color: e.target.value } }))} className="h-10" /></div>
                  <div><label className="text-sm font-medium block mb-2">Sole</label><Input type="color" value={custom.sole.color} onChange={e => setCustom(c => ({ ...c, sole: { color: e.target.value } }))} className="h-10" /></div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Material</label>
                  <Select value={custom.upper.material} onValueChange={v => setCustom(c => ({ ...c, upper: { ...c.upper, material: v } }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {product?.options.materials.map(m => <SelectItem key={m} value={m} className="capitalize">{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Text</label>
                  <Input value={custom.text} onChange={e => setCustom(c => ({ ...c, text: e.target.value }))} maxLength={12} placeholder="Max 12 chars" />
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div><label className="text-xs text-gray-600">Size: {custom.textSize}px</label><Slider min={12} max={36} value={[custom.textSize]} onValueChange={v => setCustom(c => ({ ...c, textSize: v[0] }))} /></div>
                    <div><label className="text-xs text-gray-600">Color</label><Input type="color" value={custom.textColor} onChange={e => setCustom(c => ({ ...c, textColor: e.target.value }))} className="h-8" /></div>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Button variant="outline" className="w-full" onClick={handleRandom}><Shuffle className="mr-2 h-4 w-4" /> Random</Button>
                  <Button variant="secondary" className="w-full" onClick={() => setCustom({ upper: { color: "#FFFFFF", material: "canvas" }, accent: { color: "#000000" }, sole: { color: "#FFFFFF" }, text: "", textSize: 20, textColor: "#000000" })}><RotateCcw className="mr-2 h-4 w-4" /> Reset</Button>
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* RIGHT: Preview */}
          <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-6">
            <Card className="shadow-2xl bg-white/90 backdrop-blur">
              <CardContent className="p-8">
                <div className="relative bg-gradient-to-br from-gray-100 via-orange-100 to-gray-200 rounded-3xl p-12 flex items-center justify-center min-h-[700px]">
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                    <canvas ref={canvasRef} className="border-8 border-white rounded-2xl shadow-2xl w-[800px] h-[600px]" />
                  </motion.div>
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg">
                    <p className="text-sm font-semibold text-gray-800">{product?.name} • {custom.upper.material}</p>
                  </div>
                </div>
                <div className="mt-6 text-center text-sm text-gray-600">Real-time preview</div>
              </CardContent>
            </Card>

            <AnimatePresence>
              {aiSuggestion && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Card className="shadow-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
                    <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2 text-lg"><Sparkles className="h-5 w-5" /> AI Suggestion</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => setAiSuggestion(null)}><X className="h-4 w-4" /></Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold">"{aiSuggestion.styleName}"</h3>
                        <p className="text-gray-600">{aiSuggestion.description}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {["upper", "accent", "sole"].map(k => (
                          <div key={k} className="text-center">
                            <div className="w-full h-16 rounded-lg mb-2 border-2 border-white shadow-md" style={{ backgroundColor: aiSuggestion.colors[k as keyof typeof aiSuggestion.colors] }} />
                            <p className="text-xs font-medium capitalize">{k}</p>
                          </div>
                        ))}
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <p className="text-sm"><strong>Why:</strong> {aiSuggestion.reasoning}</p>
                      </div>
                      <div className="flex gap-3">
                        <Button onClick={applyAISuggestion} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"><Check className="mr-2 h-4 w-4" /> Apply</Button>
                        <Button variant="outline" onClick={() => { setAiPrompt(""); setAiSuggestion(null); }} className="flex-1"><Wand2 className="mr-2 h-4 w-4" /> Again</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><Check className="h-6 w-6" /></div>
            <div><p className="font-semibold">Saved!</p><p className="text-sm text-green-100">In your gallery</p></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}