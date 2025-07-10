import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MessageRole } from './constants.js';
import { sendMessageToAI, startNewChat } from './services/geminiService.js';
import Avatar from './components/Avatar.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import ChatInput from './components/ChatInput.jsx';
import Footer from './components/Footer.jsx';
import Github from './components/GIthub.jsx';
import { getSystemInstruction, ROLES } from './constants.js';


const SpeechRecognitionAPI =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const isSpeechRecognitionSupported = !!SpeechRecognitionAPI;

const App = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const recognitionRef = useRef(null);
  const [micError, setMicError] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(null);
  const [selectedRole, setSelectedRole] = useState('Tutor');

  // Text-to-Speech function
  const speak = useCallback((text) => {
    if (!isTtsEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Cancel any previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find the selected voice and apply it
    if (selectedVoiceURI && voices.length > 0) {
        const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice.lang;
        }
    } else {
        const hindiVoice = voices.find(v => v.lang.toLowerCase().includes('hi'));
    if (hindiVoice) {
      utterance.voice = hindiVoice;
      utterance.lang = hindiVoice.lang;
    } else {
      utterance.lang = 'en-US'; 
    }
    }
    
    utterance.rate = 1.2; 

    window.speechSynthesis.speak(utterance);
  }, [isTtsEnabled, voices, selectedVoiceURI]);

  const handleSendMessage = useCallback(async (userInput, isSetupMessage = false) => {
    if (!userInput.trim()) {
      setIsLoading(false);
      return;
    }

    setMicError(null);
    setIsLoading(true);
    
    if (!isSetupMessage) {
      const userMessage = {
        id: `user-${Date.now()}`,
        role: MessageRole.USER,
        content: userInput,
      };
      setMessages(prevMessages => [...prevMessages, userMessage]);
    }

    try {
      const aiResponse = await sendMessageToAI(userInput);
      const modelMessage = {
        id: `model-${Date.now()}`,
        role: MessageRole.MODEL,
        content: aiResponse.response,
        correction: aiResponse.correction,
        explanation: aiResponse.explanation,
      };
      setMessages(prevMessages => [...prevMessages, modelMessage]);
      speak(aiResponse.response);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: MessageRole.MODEL,
        content: "I'm having a little trouble connecting right now. Please try again in a moment.",
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [speak]);

  const startConversation = useCallback(async (role) => {
      setIsLoading(true);
      setMessages([]);
      startNewChat(getSystemInstruction(role));
      await handleSendMessage(`Hello! Introduce yourself as my ${role}.`, true);
      setIsLoading(false);
  }, [handleSendMessage]);

  useEffect(() => {
    const loadAndSetVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
            setVoices(availableVoices);
            const hindiVoices = availableVoices.filter(v => v.lang.toLowerCase().includes('hi'));
            setSelectedVoiceURI(currentURI => {
                if (currentURI && availableVoices.some(v => v.voiceURI === currentURI)) {
                    return currentURI;
                }
                const enVoices = availableVoices.filter(v => v.lang.startsWith('en-'));
                if (enVoices.length === 0) return null;
                const preferredNames = ['Google US English', 'Samantha', 'Microsoft Zira Desktop - English (United States)'];
                let defaultVoice = enVoices.find(v => preferredNames.includes(v.name)) || enVoices.find(v => v.name.toLowerCase().includes('female')) || enVoices.find(v => v.default) || enVoices[0];
                return defaultVoice ? defaultVoice.voiceURI : null;
            });
        }
    };
    
    window.speechSynthesis.onvoiceschanged = loadAndSetVoices;
    loadAndSetVoices();
  }, []);

  // Initialize or reset chat when role changes
  useEffect(() => {
    startConversation(selectedRole);
  }, [selectedRole, startConversation]);

  // Setup speech recognition
  useEffect(() => {
    if (!isSpeechRecognitionSupported) {
      console.warn('Speech Recognition not supported by this browser.');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => { setMicError(null); setIsListening(true); };
    recognition.onend = () => { setIsListening(false); };
    recognition.onerror = (event) => {
      let errorMessage = "An error occurred during speech recognition.";
      if (event.error === 'no-speech') errorMessage = "I didn't hear you. Please try again.";
      if (event.error === 'audio-capture') errorMessage = "Microphone not found. Check your hardware.";
      if (event.error === 'not-allowed') errorMessage = "Permission to use microphone was denied.";
      setMicError(errorMessage);
      setTimeout(() => setMicError(null), 5000);
      setIsListening(false);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      handleSendMessage(transcript);
    };

    recognitionRef.current = recognition;
    return () => { recognitionRef.current?.abort(); };
  }, [handleSendMessage]);

  const handleFormSubmit = (textInput) => {
    setInput('');
    handleSendMessage(textInput);
  };

  const handleToggleListening = () => {
    if (isLoading || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setMicError(null);
      recognitionRef.current.start();
    }
  };

  const handleToggleTts = () => {
    setIsTtsEnabled(prev => {
      if (prev && window.speechSynthesis) window.speechSynthesis.cancel();
      return !prev;
    });
  };

  const handleVoiceChange = (uri) => { setSelectedVoiceURI(uri); };
  const handleRoleChange = (role) => { setSelectedRole(role); };
  const handleInputChange = (value) => {
    setInput(value);
    if (micError) setMicError(null);
  };
  
  const getPlaceholder = () => {
    if (micError) return micError;
    if (isListening) return "Listening...";
    return "Type or use the mic...";
  };

  return (
    <div className="flex h-screen w-screen justify-center items-center bg-gray-100 font-sans">
      <Github />
      <div className="flex flex-col w-full max-w-2xl h-full md:h-[95vh] md:max-h-[800px] bg-gray-50 shadow-2xl rounded-lg overflow-hidden">
        <Avatar 
          isLoading={isLoading} 
          isTtsEnabled={isTtsEnabled} 
          onToggleTts={handleToggleTts}
          voices={voices.filter(v => v.lang.startsWith('en-'))}
          selectedVoiceURI={selectedVoiceURI}
          onVoiceChange={handleVoiceChange}
          roles={ROLES}
          selectedRole={selectedRole}
          onRoleChange={handleRoleChange}
        />
        <ChatWindow messages={messages} isLoading={isLoading} />
        <ChatInput
          input={input}
          setInput={handleInputChange}
          onSendMessage={handleFormSubmit}
          isLoading={isLoading}
          isListening={isListening}
          onToggleListening={handleToggleListening}
          isSpeechRecognitionSupported={isSpeechRecognitionSupported}
          placeholder={getPlaceholder()}
          hasMicError={!!micError}
        />
        <Footer />
      </div>
    </div>
  );
};

export default App;
