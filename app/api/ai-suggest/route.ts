"use server";

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY!;
if (!API_KEY) throw new Error("GEMINI_API_KEY missing");

const genAI = new GoogleGenerativeAI(API_KEY);

interface RequestBody {
  userInput: string;
  selectedProduct: { name: string; options: { materials: string[] } };
}

const designSchema = {
  type: "object",
  properties: {
    styleName: { type: "string", description: "A 2-3 word creative name for the style." },
    description: { type: "string", description: "A single sentence explaining the concept." },
    colors: {
      type: "object",
      properties: {
        upper: { type: "string", description: "Hex code for the main upper color (e.g., '#RRGGBB')." },
        accent: { type: "string", description: "Hex code for the accent color (e.g., '#RRGGBB')." },
        sole: { type: "string", description: "Hex code for the sole color (e.g., '#RRGGBB')." },
      },
      required: ["upper", "accent", "sole"],
    },
    material: { type: "string", description: "One of the provided material options." },
    textSuggestion: { type: "string", description: "0-8 characters of suggested personalization text." },
    textColor: { type: "string", description: "Hex code for the suggested personalization text color." },
    reasoning: { type: "string", description: "2-3 sentences explaining the design choices." },
  },
  required: ["styleName", "description", "colors", "material", "textSuggestion", "textColor", "reasoning"],
} as const;

export async function POST(req: Request) {
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { userInput, selectedProduct } = body;
  if (!userInput?.trim()) return NextResponse.json({ error: "Input required" }, { status: 400 });
  if (!selectedProduct?.name || !Array.isArray(selectedProduct.options.materials))
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });

  const materials = selectedProduct.options.materials.join(", ");
  const prompt = `You are a world-class sneaker designer AI.
Design a shoe style for the ${selectedProduct.name} based on the user's request.
Available materials: ${materials}.
Respond only with valid JSON matching the schema provided.

User Request: "${userInput}"`;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 800, // ✅ Increased token limit
      responseMimeType: "application/json",
      responseSchema: designSchema,
    },
  });

  console.log("Sending to Gemini...");

  let result;
  try {
    result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
  } catch (err: any) {
    console.error("Gemini API error:", err.message);
    return NextResponse.json({ error: "AI service down" }, { status: 502 });
  }

  let responseText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  console.log("Raw response:", responseText.substring(0, 500));

  let suggestion;
  try {
    suggestion = JSON.parse(responseText);
  } catch {
    console.warn("Malformed JSON. Retrying without schema...");

    // ✅ Fallback: retry without schema
    const fallbackModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 800,
        responseMimeType: "application/json",
      },
    });

    try {
      const fallbackResult = await fallbackModel.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      responseText = fallbackResult?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      console.log("Fallback response:", responseText.substring(0, 500));
      suggestion = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        { error: "AI failed both schema and fallback attempts.", raw: responseText },
        { status: 502 }
      );
    }
  }

  const required = ["styleName", "description", "colors", "material", "textSuggestion", "textColor", "reasoning"];
  for (const field of required) {
    if (!(field in suggestion)) {
      return NextResponse.json({ error: `Missing: ${field}` }, { status: 422 });
    }
  }

  return NextResponse.json({ suggestion });
}