import { GoogleGenAI, Modality } from "@google/genai";
import { GenerationSettings, VoiceOption } from "../types";
import { base64ToUint8Array, pcmToWav } from "./audioUtils";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSpeech = async (
  text: string,
  settings: GenerationSettings,
  voice: VoiceOption
): Promise<Blob> => {
  
  // The 'gemini-2.5-flash-preview-tts' model often returns 500 Internal Error 
  // when 'systemInstruction' is used in the config. 
  // We move the style instructions into the prompt text itself.
  
  const instructionPrefix = `
    Actúa como un narrador profesional en español.
    Configuración: Acento ${settings.accent}, Estilo ${settings.style}.
    
    Instrucciones para etiquetas en el texto:
    [pausa] -> pausa notable
    [risa] -> reír
    [alto] -> hablar fuerte
    [bajo] -> hablar bajo
    [asombro] -> tono de asombro
    [llanto] -> tono de llanto
    [bostezo] -> tono de cansancio
    [burla] -> tono de burla

    Por favor lee el siguiente texto aplicando esta configuración y efectos (no leas las instrucciones, solo el texto):
    
    "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: {
        parts: [{ text: instructionPrefix }]
      },
      config: {
        // systemInstruction removed to prevent 500 errors
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voice.apiVoiceName, 
            },
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find(p => p.inlineData);

    if (!audioPart || !audioPart.inlineData?.data) {
      throw new Error("No audio data received from Gemini.");
    }

    const pcmData = base64ToUint8Array(audioPart.inlineData.data);
    
    // Gemini 2.5 Flash TTS usually outputs 24kHz PCM
    const wavBlob = pcmToWav(pcmData, 24000); 

    return wavBlob;

  } catch (error) {
    console.error("Gemini TTS Error:", error);
    throw error;
  }
};