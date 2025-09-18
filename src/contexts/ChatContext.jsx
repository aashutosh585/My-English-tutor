import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { MessageRole } from '../constants.js';
import { sendMessageToAI, startNewChat } from '../services/geminiService.js';
import { storageService } from '../utils/storageService.js';
import { useVoice } from './VoiceContext.jsx';
import { useAvatar } from './AvatarContext.jsx';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
const isSpeechRecognitionSupported = !!SpeechRecognitionAPI;

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState(null);
  const [selectedRole, setSelectedRole] = useState('Tutor');
  const [activeSessionId, setActiveSessionId] = useState(null);
  
  const recognitionRef = useRef(null);
  const { speak } = useVoice();
  const { getActiveAvatar, getSystemInstructionForAvatar } = useAvatar();

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

    recognition.onstart = () => {
      setMicError(null);
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

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

    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  // Send message to AI
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
        timestamp: Date.now()
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
        timestamp: Date.now()
      };
      
      setMessages(prevMessages => [...prevMessages, modelMessage]);
      
      // Speak the response with avatar voice settings if available
      const activeAvatar = getActiveAvatar();
      if (activeAvatar && activeAvatar.voice) {
        speak(aiResponse.response, activeAvatar.voice);
      } else {
        speak(aiResponse.response);
      }
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: MessageRole.MODEL,
        content: "I'm having a little trouble connecting right now. Please try again in a moment.",
        timestamp: Date.now()
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [speak, getActiveAvatar]);

  // Start a new conversation
  const startConversation = useCallback(async (role = null, avatarId = null) => {
    setIsLoading(true);
    setMessages([]);
    
    // Generate new session ID
    const sessionId = `session-${Date.now()}`;
    setActiveSessionId(sessionId);

    // Get system instruction based on avatar or role
    const systemInstruction = getSystemInstructionForAvatar(role);
    startNewChat(systemInstruction);

    try {
      const activeAvatar = getActiveAvatar();
      const userInput = activeAvatar 
        ? `Hello! I'm ${activeAvatar.name}, your ${activeAvatar.role}. How can I help you practice English today?`
        : `Hello! Introduce yourself as my ${role || selectedRole}.`;

      const aiResponse = await sendMessageToAI(userInput);
      const modelMessage = {
        id: `model-${Date.now()}`,
        role: MessageRole.MODEL,
        content: aiResponse.response,
        correction: aiResponse.correction,
        explanation: aiResponse.explanation,
        timestamp: Date.now()
      };
      
      setMessages([modelMessage]);
      
      // Speak with avatar voice if available
      if (activeAvatar && activeAvatar.voice) {
        speak(aiResponse.response, activeAvatar.voice);
      } else {
        speak(aiResponse.response);
      }
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: MessageRole.MODEL,
        content: "I'm having a little trouble connecting right now. Please try again in a moment.",
        timestamp: Date.now()
      };
      setMessages([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRole, speak, getActiveAvatar, getSystemInstructionForAvatar]);

  // Save current session
  const saveCurrentSession = useCallback(() => {
    if (activeSessionId && messages.length > 0) {
      const session = {
        id: activeSessionId,
        messages,
        selectedRole,
        avatarId: getActiveAvatar()?.id || null,
        updatedAt: Date.now()
      };
      storageService.saveSession(session);
    }
  }, [activeSessionId, messages, selectedRole, getActiveAvatar]);

  // Load a session
  const loadSession = useCallback((sessionId) => {
    const session = storageService.getSession(sessionId);
    if (session) {
      setMessages(session.messages);
      setSelectedRole(session.selectedRole);
      setActiveSessionId(session.id);
      
      // Restart chat with the same system instruction
      const systemInstruction = getSystemInstructionForAvatar(session.selectedRole);
      startNewChat(systemInstruction);
      
      return true;
    }
    return false;
  }, [getSystemInstructionForAvatar]);

  // Load last session
  const loadLastSession = useCallback(() => {
    const lastSession = storageService.getLastSession();
    if (lastSession) {
      return loadSession(lastSession.id);
    }
    return false;
  }, [loadSession]);

  // Auto-save session whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveCurrentSession();
    }
  }, [messages, saveCurrentSession]);

  // Toggle microphone listening
  const toggleListening = useCallback(() => {
    if (isLoading || !recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setMicError(null);
      recognitionRef.current.start();
    }
  }, [isLoading, isListening]);

  // Send audio file (for future transcription)
  const sendAudioFile = useCallback(async (file) => {
    // For now, this is a placeholder
    // In the future, you could add transcription service here
    console.log('Audio file upload:', file);
    setMicError('Audio file transcription not yet implemented. Please use the microphone instead.');
    setTimeout(() => setMicError(null), 3000);
  }, []);

  // Update input
  const updateInput = useCallback((value) => {
    setInput(value);
    if (micError) setMicError(null);
  }, [micError]);

  // Get placeholder text
  const getPlaceholder = useCallback(() => {
    if (micError) return micError;
    if (isListening) return "Listening...";
    return "Type or use the mic...";
  }, [micError, isListening]);

  // Start new chat (reset current session)
  const startNewChatSession = useCallback(() => {
    const activeAvatar = getActiveAvatar();
    if (activeAvatar) {
      startConversation(activeAvatar.role, activeAvatar.id);
    } else {
      startConversation(selectedRole);
    }
  }, [startConversation, selectedRole, getActiveAvatar]);

  const value = {
    messages,
    isLoading,
    input,
    isListening,
    micError,
    selectedRole,
    activeSessionId,
    isSpeechRecognitionSupported,
    handleSendMessage,
    startConversation,
    startNewChat: startNewChatSession,
    loadSession,
    loadLastSession,
    toggleListening,
    sendAudioFile,
    updateInput,
    getPlaceholder,
    setSelectedRole
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};