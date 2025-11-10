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

/**
 * keep the JSON schema you want the model to follow.
 * We'll cast it to `any` when we hand it to the SDK to satisfy TS.
 */
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

/** minimal runtime validator to ensure structure after JSON.parse */
function validateSuggestion(s: any): s is {
  styleName: string;
  description: string;
  colors: { upper: string; accent: string; sole: string };
  material: string;
  textSuggestion: string;
  textColor: string;
  reasoning: string;
} {
  if (!s || typeof s !== "object") return false;
  const req = ["styleName","description","colors","material","textSuggestion","textColor","reasoning"];
  for (const r of req) if (!(r in s)) return false;
  if (typeof s.styleName !== "string") return false;
  if (typeof s.description !== "string") return false;
  if (typeof s.material !== "string") return false;
  if (typeof s.textSuggestion !== "string") return false;
  if (typeof s.textColor !== "string") return false;
  if (typeof s.reasoning !== "string") return false;
  if (typeof s.colors !== "object") return false;
  if (typeof s.colors.upper !== "string" || typeof s.colors.accent !== "string" || typeof s.colors.sole !== "string") return false;
  return true;
}

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
      maxOutputTokens: 800,
      responseMimeType: "application/json",
      // Cast the schema to `any` to satisfy the SDK TS signatures.
      // The runtime validator below will still check the parsed response.
      responseSchema: designSchema as any,
    },
  });

  let result;
  try {
    result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
  } catch (err: any) {
    console.error("Gemini API error:", err?.message || err);
    return NextResponse.json({ error: "AI service down" }, { status: 502 });
  }

  let responseText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  let suggestion;
  try {
    suggestion = JSON.parse(responseText);
  } catch {
    // Fallback attempt without schema
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
      suggestion = JSON.parse(responseText);
    } catch (err) {
      return NextResponse.json(
        { error: "AI failed both schema and fallback attempts.", raw: responseText },
        { status: 502 }
      );
    }
  }

  // runtime validation
  if (!validateSuggestion(suggestion)) {
    return NextResponse.json({ error: "Invalid suggestion shape", raw: suggestion }, { status: 422 });
  }

  return NextResponse.json({ suggestion });
}

