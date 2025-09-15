import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""

async function isPlantImage(imageBase64: string): Promise<boolean> {
  return true
}

export async function POST(req: Request) {
  try {
    const { prompt, language, imageBase64 } = await req.json()

    if (!prompt && !imageBase64) {
      return NextResponse.json(
        { error: "Prompt or image is required" },
        { status: 400 }
      )
    }

    // 1. Check if image is plant
    if (imageBase64) {
      const plantCheck = await isPlantImage(imageBase64)
      if (!plantCheck) {
        return NextResponse.json({
          crops:
            language === "ml"
              ? "ദയവായി സസ്യത്തിന്റെ ചിത്രം അപ്‌ലോഡ് ചെയ്യുക."
              : "Please upload a plant image only.",
        })
      }
    }

    // 2. Initialize Gemini
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // 3. Crop-disease instructions with Markdown + web search
    const instruction =
      language === "ml"
        ? `You are a crop doctor. Reply only in Malayalam.
- If the image contains a plant, describe the disease and how to cure it.
- Format disease name in **bold**.
- You may provide important steps or chemicals in *italics*.
- Optionally include links to websites for more info as [text](url).
- Do not add anything else.
- If it's not a plant, reply: 'Please upload a plant image only.'
- Respond in Markdown.`
        : `You are a crop doctor.
- If the image contains a plant, describe the disease and how to cure it.
- Format disease name in **bold**.
- You may provide important steps or chemicals in *italics*.
- Optionally include links to websites for more info as [text](url).
- Do not add anything else.
- If it's not a plant, reply: 'Please upload a plant image only.'
- Respond in Markdown.`

    // 4. Prepare content parts
    const parts: any[] = [{ text: `${instruction}\n\n${prompt || ""}` }]

    if (imageBase64) {
      const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/)
      const mimeType = mimeMatch ? mimeMatch[1] : "image/png"

      parts.push({
        inlineData: {
          mimeType,
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
        },
      })
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
    })

    const text = result.response.text()

    return NextResponse.json({ crops: text })
  } catch (err: any) {
    console.error("Error in /api/crops:", err)
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    )
  }
}
