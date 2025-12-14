import { Accent, VoiceOption, VoiceStyle } from './types';
import { Sparkles, Pause, Smile, Volume2, Volume1, Frown, Coffee, Zap } from 'lucide-react';

// Mapping UI voices to Gemini API voices
// We map 10 UI options to the available API voices (Puck, Charon, Kore, Fenrir, Aoede)
// We will use system instructions to differentiate "Voice 1" from "Voice 2" if they share a model.
export const VOICES: VoiceOption[] = [
  // Men
  { id: 'm1', name: 'Hombre 1 (Fenrir)', gender: 'male', apiVoiceName: 'Fenrir' },
  { id: 'm2', name: 'Hombre 2 (Puck)', gender: 'male', apiVoiceName: 'Puck' },
  { id: 'm3', name: 'Hombre 3 (Charon)', gender: 'male', apiVoiceName: 'Charon' },
  { id: 'm4', name: 'Hombre 4 (Orion)', gender: 'male', apiVoiceName: 'Fenrir' }, // Reusing Fenrir with different persona prompt
  { id: 'm5', name: 'Hombre 5 (Zeus)', gender: 'male', apiVoiceName: 'Charon' },  // Reusing Charon
  // Women
  { id: 'f1', name: 'Mujer 1 (Kore)', gender: 'female', apiVoiceName: 'Kore' },
  { id: 'f2', name: 'Mujer 2 (Aoede)', gender: 'female', apiVoiceName: 'Aoede' },
  { id: 'f3', name: 'Mujer 3 (Zephyr)', gender: 'female', apiVoiceName: 'Zephyr' }, // Zephyr is often unisex/female leaning
  { id: 'f4', name: 'Mujer 4 (Luna)', gender: 'female', apiVoiceName: 'Kore' },    // Reusing Kore
  { id: 'f5', name: 'Mujer 5 (Sol)', gender: 'female', apiVoiceName: 'Aoede' },    // Reusing Aoede
];

export const ACCENTS = [
  Accent.COLOMBIA,
  Accent.VENEZUELA,
  Accent.MEXICO,
  Accent.ARGENTINA,
];

export const STYLES = [
  VoiceStyle.NATURAL,
  VoiceStyle.ALEGRE,
  VoiceStyle.TRISTE,
  VoiceStyle.SUSURRAR,
  VoiceStyle.STORYTELLER,
];

export const TAGS = [
  { label: '[pausa]', icon: Pause, desc: 'Pausa 2s' },
  { label: '[risa]', icon: Smile, desc: 'Risa' },
  { label: '[alto]', icon: Volume2, desc: 'Voz alta' },
  { label: '[bajo]', icon: Volume1, desc: 'Voz baja' },
  { label: '[asombro]', icon: Zap, desc: 'Asombro' },
  { label: '[llanto]', icon: Frown, desc: 'Llanto' },
  { label: '[bostezo]', icon: Coffee, desc: 'Bostezo' },
  { label: '[burla]', icon: Sparkles, desc: 'Burla' },
];
