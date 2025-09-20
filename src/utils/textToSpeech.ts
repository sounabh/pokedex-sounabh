class TextToSpeechService {
  private synthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  speak(text: string, onEnd?: () => void): void {
    // Stop any ongoing speech
    this.stop();

    // Create new utterance
    this.currentUtterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings for Pokédex-like speech
    this.currentUtterance.rate = 0.9; // Slightly slower for clarity
    this.currentUtterance.pitch = 1.0; // Normal pitch
    this.currentUtterance.volume = 0.8; // Comfortable volume

    // Try to use a more robotic/digital voice if available
    const voices = this.synthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.name.includes('Alex') ||
      voice.name.includes('Daniel')
    );
    
    if (preferredVoice) {
      this.currentUtterance.voice = preferredVoice;
    }

    // Set up event handlers
    this.currentUtterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.currentUtterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    // Speak the text
    this.synthesis.speak(this.currentUtterance);
  }

  stop(): void {
    if (this.synthesis.speaking || this.synthesis.pending) {
      this.synthesis.cancel();
    }
    this.currentUtterance = null;
  }

  isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  // Get available voices for potential future customization
  getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices();
  }
}

export const textToSpeech = new TextToSpeechService();