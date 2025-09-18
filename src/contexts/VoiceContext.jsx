import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../utils/storageService.js';

const VoiceContext = createContext();

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

export const VoiceProvider = ({ children }) => {
  const [voices, setVoices] = useState([]);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(null);
  const [rate, setRate] = useState(1.2);
  const [pitch, setPitch] = useState(1);
  const [lang, setLang] = useState('en-US');

  // Load voice preferences from storage
  useEffect(() => {
    const prefs = storageService.getVoicePrefs();
    setIsTtsEnabled(prefs.isTtsEnabled);
    setSelectedVoiceURI(prefs.selectedVoiceURI);
    setRate(prefs.rate);
    setPitch(prefs.pitch);
    setLang(prefs.lang);
  }, []);

  // Save voice preferences to storage
  const savePreferences = useCallback(() => {
    storageService.setVoicePrefs({
      isTtsEnabled,
      selectedVoiceURI,
      rate,
      pitch,
      lang
    });
  }, [isTtsEnabled, selectedVoiceURI, rate, pitch, lang]);

  useEffect(() => {
    savePreferences();
  }, [savePreferences]);

  // Load and set available voices
  const loadAndSetVoices = useCallback(() => {
    const availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices.length > 0) {
      setVoices(availableVoices);
      
      // Auto-select a good default voice if none selected
      if (!selectedVoiceURI && availableVoices.length > 0) {
        const enVoices = availableVoices.filter(v => v.lang.startsWith('en-'));
        if (enVoices.length > 0) {
          const preferredNames = [
            'Google US English', 
            'Samantha', 
            'Microsoft Zira Desktop - English (United States)'
          ];
          const defaultVoice = enVoices.find(v => preferredNames.includes(v.name)) ||
                              enVoices.find(v => v.name.toLowerCase().includes('female')) ||
                              enVoices.find(v => v.default) ||
                              enVoices[0];
          
          if (defaultVoice) {
            setSelectedVoiceURI(defaultVoice.voiceURI);
          }
        }
      }
    }
  }, [selectedVoiceURI]);

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = loadAndSetVoices;
    loadAndSetVoices();
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [loadAndSetVoices]);

  // Text-to-Speech function
  const speak = useCallback((text, customVoiceSettings = {}) => {
    if (!isTtsEnabled || !window.speechSynthesis || !text) return;
    
    window.speechSynthesis.cancel(); // Cancel any previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Use custom settings or defaults
    const voiceURI = customVoiceSettings.voiceURI || selectedVoiceURI;
    const voiceRate = customVoiceSettings.rate || rate;
    const voicePitch = customVoiceSettings.pitch || pitch;
    const voiceLang = customVoiceSettings.lang || lang;
    
    // Find and apply the selected voice
    if (voiceURI && voices.length > 0) {
      const selectedVoice = voices.find(v => v.voiceURI === voiceURI);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
      }
    } else {
      // Fallback to Hindi or English voice
      const hindiVoice = voices.find(v => v.lang.toLowerCase().includes('hi'));
      if (hindiVoice) {
        utterance.voice = hindiVoice;
        utterance.lang = hindiVoice.lang;
      } else {
        utterance.lang = voiceLang;
      }
    }
    
    utterance.rate = voiceRate;
    utterance.pitch = voicePitch;

    window.speechSynthesis.speak(utterance);
  }, [isTtsEnabled, voices, selectedVoiceURI, rate, pitch, lang]);

  // Cancel current speech
  const cancel = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Toggle TTS
  const toggleTts = useCallback(() => {
    setIsTtsEnabled(prev => {
      if (prev && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return !prev;
    });
  }, []);

  // Update voice settings
  const updateVoiceSettings = useCallback((settings) => {
    if (settings.voiceURI !== undefined) setSelectedVoiceURI(settings.voiceURI);
    if (settings.rate !== undefined) setRate(settings.rate);
    if (settings.pitch !== undefined) setPitch(settings.pitch);
    if (settings.lang !== undefined) setLang(settings.lang);
  }, []);

  const value = {
    voices,
    isTtsEnabled,
    selectedVoiceURI,
    rate,
    pitch,
    lang,
    speak,
    cancel,
    toggleTts,
    updateVoiceSettings,
    setSelectedVoiceURI,
    setRate,
    setPitch,
    setLang
  };

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  );
};