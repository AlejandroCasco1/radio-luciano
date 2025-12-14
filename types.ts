export interface VoiceOption {
  id: string;
  name: string;
  gender: 'male' | 'female';
  apiVoiceName: string; // The actual name sent to Gemini (e.g., 'Fenrir')
}

export interface AudioEntry {
  id: string;
  text: string;
  blobUrl: string;
  timestamp: number;
  settings: {
    voice: string;
    accent: string;
    style: string;
  };
}

export enum Accent {
  COLOMBIA = 'Colombia',
  VENEZUELA = 'Venezuela',
  MEXICO = 'México',
  ARGENTINA = 'Argentina',
  NEUTRAL = 'Neutro'
}

export enum VoiceStyle {
  ALEGRE = 'Alegre',
  TRISTE = 'Triste',
  SUSURRAR = 'Susurrar',
  STORYTELLER = 'Storyteller',
  NATURAL = 'Natural'
}

export interface GenerationSettings {
  voiceId: string;
  accent: Accent;
  style: VoiceStyle;
  speed: number; // 0.5 to 2.0
  pitch: number; // -10 to 10
}
