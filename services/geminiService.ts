import { GoogleGenAI } from "@google/genai";
import { AppTier, GenerationParams, BodyPlacement } from "../types";

export const generateTattooDesign = async (params: GenerationParams): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const { concept, placement, style, tier, variationIndex = 0, isProjectItem = false } = params;

  // Use Flash model for speed and efficiency.
  const modelName = 'gemini-2.5-flash-image';

  let visualContext = "";
  
  // If it's a Project Item (for the Sleeve Builder) OR explicitly Paper Flash
  if (isProjectItem || placement === BodyPlacement.PAPER) {
      visualContext = `
      CONTEXT: Professional Tattoo Flash Element.
      BACKGROUND: Pure white background (#FFFFFF). 
      IMPORTANT: Do NOT render a body part. Just the tattoo design isolated.
      RENDERING: Clean vector lines, high contrast stencil ready.
      This element will be digitally composited onto a body later.
      If style is Traditional, use bold black outlines. 
      If style is Realism, use high contrast shading.
      `;
  } else {
      // Single Shot Visualizer Mode
      visualContext = `
      CONTEXT: Photorealistic simulation of a tattoo inked on skin.
      BODY PLACEMENT: ${placement}.
      RENDERING: Show the tattoo design actually on the ${placement} of a human body.
      Lighting should be studio quality to show the ink clearly.
      Skin texture should be realistic.
      `;
  }

  const prompt = `
    Design a professional tattoo.
    
    SUBJECT: "${concept}"
    STYLE: ${style}
    VARIATION: #${variationIndex + 1}
    
    ${visualContext}
    
    ARTISTIC REQUIREMENTS:
    - Masterpiece quality ink.
    - If color is used in the style (e.g. Watercolor, New School), make it vibrant.
    - If style is Blackwork/Dotwork, strictly monochrome.
    - No text or watermarks.
    
    Make it look like a high-end tattoo artist's portfolio piece.
  `;

  const imageConfig: any = {
    aspectRatio: "3:4"
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig
      },
    });

    for (const candidate of response.candidates || []) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64Data}`;
        }
      }
    }

    throw new Error("No image data found in response.");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.status === 403 || error.code === 403 || (error.message && error.message.includes('permission'))) {
       throw new Error("PERMISSION_DENIED");
    }
    throw error;
  }
};