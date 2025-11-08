'use client'

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
import { Download, RotateCcw, Shuffle, Upload, Sparkles, Eye, Check, Wand2, Loader2, X, ThumbsUp, ArrowRight, Palette, Zap } from "lucide-react";

// Sneaker products with real-world inspired data
const products = [
  { 
    id: "air-max-90", 
    name: "Air Max 90", 
    baseImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f8f8f8' width='400' height='300'/%3E%3Cpath d='M70 120 Q100 80 180 95 Q260 110 330 105 L330 200 Q260 210 180 190 Q100 170 70 200 Z' fill='%23e0e0e0'/%3E%3Cellipse cx='120' cy='180' rx='25' ry='15' fill='%23999'/%3E%3Cellipse cx='280' cy='185' rx='25' ry='15' fill='%23999'/%3E%3Cpath d='M90 130 L310 140 L310 165 L90 155 Z' fill='%23ccc'/%3E%3C/svg%3E",
    options: { materials: ["canvas", "leather", "suede", "mesh"] },
    category: "classic"
  },
  { 
    id: "jordan-1", 
    name: "Jordan 1", 
    baseImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f8f8f8' width='400' height='300'/%3E%3Cpath d='M60 110 Q95 70 175 85 Q255 100 340 95 L340 210 Q255 220 175 200 Q95 180 60 210 Z' fill='%23e0e0e0'/%3E%3Cpath d='M80 120 L320 130 L320 145 L80 135 Z' fill='%23d0d0d0'/%3E%3Cellipse cx='115' cy='190' rx='30' ry='18' fill='%23888'/%3E%3Cellipse cx='285' cy='195' rx='30' ry='18' fill='%23888'/%3E%3Cpath d='M100 95 Q180 85 300 100' stroke='%23aaa' stroke-width='3' fill='none'/%3E%3C/svg%3E",
    options: { materials: ["canvas", "leather", "suede", "patent"] },
    category: "basketball"
  },
  { 
    id: "dunk-low", 
    name: "Dunk Low", 
    baseImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f8f8f8' width='400' height='300'/%3E%3Cpath d='M75 125 Q105 85 185 100 Q265 115 325 110 L325 195 Q265 205 185 185 Q105 165 75 195 Z' fill='%23e5e5e5'/%3E%3Cpath d='M95 135 L305 142 L305 158 L95 150 Z' fill='%23d5d5d5'/%3E%3Cellipse cx='125' cy='175' rx='22' ry='13' fill='%23999'/%3E%3Cellipse cx='275' cy='178' rx='22' ry='13' fill='%23999'/%3E%3Cpath d='M110 110 L290 118' stroke='%23bbb' stroke-width='2.5' fill='none'/%3E%3C/svg%3E",
    options: { materials: ["canvas", "leather", "nubuck"] },
    category: "skateboard"
  }
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
  { name: "Burgundy", color: "#800020", vibe: "rich, refined" }
];

// AI suggestion templates for better prompts
const quickPrompts = [
  "Summer beach vibes",
  "Retro 80s style",
  "Professional business look",
  "Sporty and bold",
  "Minimalist aesthetic",
  "Streetwear culture"
];

export default function AIShoeCustomizer() {
  const canvasRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState("air-max-90");
  const [custom, setCustom] = useState({
    upper: { color: "#FFFFFF", material: "canvas" },
    accent: { color: "#000000" },
    sole: { color: "#FFFFFF" },
    text: "",
    textSize: 20,
    textColor: "#000000",
  });
  const [file, setFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hoveredColor, setHoveredColor] = useState(null);
  
  // AI Features
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);

  // Render canvas whenever customization changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 500;
    canvas.height = 350;
    ctx.clearRect(0, 0, 500, 350);

    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const baseImg = new Image();
    baseImg.onload = () => {
      // Draw base shoe outline
      ctx.drawImage(baseImg, 0, 0, 500, 350);

      // Apply texture if uploaded
      if (file) {
        const texture = new Image();
        texture.onload = () => {
          ctx.globalAlpha = 0.5;
          ctx.drawImage(texture, 80, 60, 340, 150);
          ctx.globalAlpha = 1;
        };
        texture.src = URL.createObjectURL(file);
      }

      // Upper shoe body with gradient
      const upperGradient = ctx.createLinearGradient(80, 60, 340, 210);
      upperGradient.addColorStop(0, custom.upper.color);
      upperGradient.addColorStop(1, adjustBrightness(custom.upper.color, -15));
      ctx.fillStyle = upperGradient;
      ctx.globalAlpha = custom.upper.material === "leather" ? 0.88 : 0.92;
      ctx.fillRect(80, 60, 340, 150);
      ctx.globalAlpha = 1;

      // Accent stripe
      ctx.fillStyle = custom.accent.color;
      ctx.fillRect(95, 135, 310, 23);

      // Sole
      ctx.fillStyle = custom.sole.color;
      ctx.fillRect(70, 195, 340, 25);

      // Shine effect for premium feel
      const shine = ctx.createLinearGradient(100, 70, 380, 100);
      shine.addColorStop(0, "rgba(255,255,255,0)");
      shine.addColorStop(0.5, "rgba(255,255,255,0.4)");
      shine.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = shine;
      ctx.fillRect(100, 70, 300, 40);

      // Custom text engraving
      if (custom.text) {
        ctx.fillStyle = custom.textColor;
        ctx.font = `bold ${custom.textSize}px 'Arial Black', sans-serif`;
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(0,0,0,0.4)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(custom.text, 250, 140);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
    };
    baseImg.src = product.baseImage;
  }, [custom, selectedProduct, file]);

  const adjustBrightness = (color, percent) => {
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, Math.min(255, (num >> 16) + amt));
    const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
    const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
    return "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
  };

  const handleRandom = () => {
    const rand1 = colorPresets[Math.floor(Math.random() * colorPresets.length)];
    const rand2 = colorPresets[Math.floor(Math.random() * colorPresets.length)];
    const rand3 = colorPresets[Math.floor(Math.random() * colorPresets.length)];
    
    setCustom((c) => ({
      ...c,
      upper: { ...c.upper, color: rand1.color },
      accent: { color: rand2.color },
      sole: { color: rand3.color }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save to backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAIRequest = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsAiLoading(true);
    setAiError(null);
    setShowAiPanel(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            ...conversationHistory,
            {
              role: "user",
              content: `You are an expert sneaker designer. The user wants: "${aiPrompt}"

Current sneaker: ${products.find(p => p.id === selectedProduct)?.name}
Available materials: ${products.find(p => p.id === selectedProduct)?.options.materials.join(", ")}

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "styleName": "Creative 2-3 word name for this design",
  "description": "Brief 1-sentence description of the vibe",
  "colors": {
    "upper": "#hexcode",
    "accent": "#hexcode",
    "sole": "#hexcode"
  },
  "material": "one of the available materials",
  "textSuggestion": "Optional 3-8 char text to engrave",
  "reasoning": "2-3 sentences explaining why these choices work"
}`
            }
          ],
        })
      });

      const data = await response.json();
      const aiText = data.content.find(item => item.type === "text")?.text || "";
      
      // Clean and parse JSON
      const cleanJson = aiText.replace(/```json|```/g, "").trim();
      const suggestion = JSON.parse(cleanJson);
      
      setAiSuggestion(suggestion);
      
      // Add to conversation history
      setConversationHistory([
        ...conversationHistory,
        { role: "user", content: aiPrompt },
        { role: "assistant", content: aiText }
      ]);
      
    } catch (error) {
      console.error("AI Error:", error);
      setAiError("Couldn't generate suggestions. Try rephrasing your request!");
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
      text: aiSuggestion.textSuggestion || custom.text,
      textSize: custom.textSize,
      textColor: custom.textColor,
    });
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const product = products.find((p) => p.id === selectedProduct);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm"
      >
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
              <Wand2 className="h-3 w-3" />
              AI Assistant Active
            </Badge>
            <Button variant="outline" size="sm">
              Gallery
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[380px_1fr] gap-8">
          {/* LEFT - Controls Panel */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* AI Assistant Card */}
            <Card className="shadow-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wand2 className="h-5 w-5" />
                  AI Design Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2 text-gray-700">
                    Describe your vision
                  </label>
                  <Textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., 'Create a summer beach vibe with turquoise and sand colors'"
                    className="resize-none h-24 bg-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        handleAIRequest();
                      }
                    }}
                  />
                </div>

                {/* Quick prompts */}
                <div>
                  <p className="text-xs text-gray-600 mb-2">Quick ideas:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickPrompts.slice(0, 3).map((prompt) => (
                      <Badge
                        key={prompt}
                        variant="outline"
                        className="cursor-pointer hover:bg-orange-100 transition-colors text-xs"
                        onClick={() => setAiPrompt(prompt)}
                      >
                        {prompt}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleAIRequest}
                  disabled={isAiLoading || !aiPrompt.trim()}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
                >
                  {isAiLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      AI Thinking...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Design
                    </>
                  )}
                </Button>

                {aiError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
                  >
                    {aiError}
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Main Customization Card */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Manual Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Product Selection */}
                <div>
                  <label className="text-sm font-medium block mb-2">Sneaker Model</label>
                  <Tabs value={selectedProduct} onValueChange={setSelectedProduct}>
                    <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                      {products.map((p) => (
                        <TabsTrigger
                          key={p.id}
                          value={p.id}
                          className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                        >
                          {p.name.split(' ')[0]}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                {/* Upper Color */}
                <div>
                  <label className="text-sm font-medium block mb-3">Upper Color</label>
                  <div className="grid grid-cols-6 gap-2 mb-3">
                    {colorPresets.slice(0, 12).map((preset) => (
                      <motion.button
                        key={preset.color}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCustom(c => ({ ...c, upper: { ...c.upper, color: preset.color } }))}
                        className="relative h-10 rounded-lg shadow-md border-2 transition-all"
                        style={{ 
                          backgroundColor: preset.color,
                          borderColor: custom.upper.color === preset.color ? '#f97316' : 'transparent'
                        }}
                      >
                        {custom.upper.color === preset.color && (
                          <Check className="h-4 w-4 text-white drop-shadow-lg absolute inset-0 m-auto" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                  <Input
                    type="color"
                    value={custom.upper.color}
                    onChange={(e) => setCustom(c => ({ ...c, upper: { ...c.upper, color: e.target.value } }))}
                    className="h-10 w-full cursor-pointer"
                  />
                </div>

                {/* Accent & Sole */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Accent</label>
                    <Input
                      type="color"
                      value={custom.accent.color}
                      onChange={(e) => setCustom(c => ({ ...c, accent: { color: e.target.value } }))}
                      className="h-10 w-full cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">Sole</label>
                    <Input
                      type="color"
                      value={custom.sole.color}
                      onChange={(e) => setCustom(c => ({ ...c, sole: { color: e.target.value } }))}
                      className="h-10 w-full cursor-pointer"
                    />
                  </div>
                </div>

                {/* Material */}
                <div>
                  <label className="text-sm font-medium block mb-2">Material</label>
                  <Select
                    value={custom.upper.material}
                    onValueChange={(val) => setCustom(c => ({ ...c, upper: { ...c.upper, material: val } }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {product?.options.materials.map((m) => (
                        <SelectItem key={m} value={m} className="capitalize">
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Texture Upload */}
                <div>
                  <label className="text-sm font-medium block mb-2">Texture Pattern</label>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {file ? file.name : "Upload Pattern"}
                  </Button>
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </div>

                {/* Text Engraving */}
                <div>
                  <label className="text-sm font-medium block mb-2">Custom Text</label>
                  <Input
                    value={custom.text}
                    onChange={(e) => setCustom(c => ({ ...c, text: e.target.value }))}
                    placeholder="Your text (max 12 chars)"
                    maxLength={12}
                  />
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-600">Size: {custom.textSize}px</label>
                      <Slider
                        min={12}
                        max={36}
                        value={[custom.textSize]}
                        onValueChange={(v) => setCustom(c => ({ ...c, textSize: v[0] }))}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Color</label>
                      <Input
                        type="color"
                        value={custom.textColor}
                        onChange={(e) => setCustom(c => ({ ...c, textColor: e.target.value }))}
                        className="h-8 w-full cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4 border-t">
                  <Button variant="outline" className="w-full" onClick={handleRandom}>
                    <Shuffle className="mr-2 h-4 w-4" />
                    Random Colors
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      setCustom({
                        upper: { color: "#FFFFFF", material: "canvas" },
                        accent: { color: "#000000" },
                        sole: { color: "#FFFFFF" },
                        text: "",
                        textSize: 20,
                        textColor: "#000000",
                      });
                      setFile(null);
                    }}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset All
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    {isSaving ? "Saving..." : "Save Design"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* RIGHT - Preview & AI Suggestions */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Main Canvas */}
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur overflow-hidden">
              <CardContent className="p-8">
                <div className="relative bg-gradient-to-br from-gray-100 via-orange-100 to-gray-200 rounded-3xl p-12 flex items-center justify-center min-h-[500px]">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <canvas
                      ref={canvasRef}
                      className="border-8 border-white rounded-2xl shadow-2xl max-w-full"
                    />
                  </motion.div>

                  {/* Product info badge */}
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg">
                    <p className="text-sm font-semibold text-gray-800">
                      {product?.name} • {custom.upper.material}
                    </p>
                  </div>
                </div>

                <div className="mt-6 text-center text-sm text-gray-600">
                  <p>Real-time preview • High-resolution export available</p>
                </div>
              </CardContent>
            </Card>

            {/* AI Suggestion Panel */}
            <AnimatePresence>
              {aiSuggestion && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                >
                  <Card className="shadow-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Sparkles className="h-5 w-5" />
                          AI Suggestion Ready
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                          onClick={() => setAiSuggestion(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">
                          "{aiSuggestion.styleName}"
                        </h3>
                        <p className="text-gray-600">{aiSuggestion.description}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                          <div
                            className="w-full h-16 rounded-lg mb-2 shadow-md border-2 border-white"
                            style={{ backgroundColor: aiSuggestion.colors.upper }}
                          />
                          <p className="text-xs font-medium text-gray-700">Upper</p>
                        </div>
                        <div className="text-center">
                          <div
                            className="w-full h-16 rounded-lg mb-2 shadow-md border-2 border-white"
                            style={{ backgroundColor: aiSuggestion.colors.accent }}
                          />
                          <p className="text-xs font-medium text-gray-700">Accent</p>
                        </div>
                        <div className="text-center">
                          <div
                            className="w-full h-16 rounded-lg mb-2 shadow-md border-2 border-white"
                            style={{ backgroundColor: aiSuggestion.colors.sole }}
                          />
                          <p className="text-xs font-medium text-gray-700">Sole</p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          <span className="font-semibold">Why this works:</span> {aiSuggestion.reasoning}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={applyAISuggestion}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Apply Design
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setAiPrompt("");
                            setAiSuggestion(null);
                          }}
                          className="flex-1"
                        >
                          <Wand2 className="mr-2 h-4 w-4" />
                          Try Again
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50"
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">Design Saved!</p>
              <p className="text-sm text-green-100">Added to your gallery</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}