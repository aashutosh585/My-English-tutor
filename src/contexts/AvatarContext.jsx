import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../utils/storageService.js';
import { getSystemInstruction, ROLES, getAIName, CUSTOM_ROLE_TEMPLATES } from '../constants.js';
import { aiContentManager, getPersonalitySystemInstruction } from '../services/content.js';

const AvatarContext = createContext();

export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error('useAvatar must be used within an AvatarProvider');
  }
  return context;
};

export const AvatarProvider = ({ children }) => {
  const [avatars, setAvatars] = useState([]);
  const [activeAvatarId, setActiveAvatarId] = useState(null);

  // Load avatars and active avatar from storage
  useEffect(() => {
    const savedAvatars = storageService.getAvatars();
    const savedActiveId = storageService.getActiveAvatarId();
    setAvatars(savedAvatars);
    setActiveAvatarId(savedActiveId);
  }, []);

  // Save avatars to storage whenever they change
  useEffect(() => {
    storageService.setAvatars(avatars);
  }, [avatars]);

  // Save active avatar ID whenever it changes
  useEffect(() => {
    storageService.setActiveAvatarId(activeAvatarId);
  }, [activeAvatarId]);

  // Create a new avatar
  const createAvatar = useCallback((avatarData) => {
    const newAvatar = {
      id: `avatar-${Date.now()}`,
      name: avatarData.name,
      role: avatarData.role || 'Custom',
      imageUrl: avatarData.imageUrl || null,
      logoUrl: avatarData.logoUrl || null,
      sampleAudioUrl: avatarData.sampleAudioUrl || null,
      voice: {
        selectedVoiceURI: avatarData.voice?.selectedVoiceURI || null,
        rate: avatarData.voice?.rate || 1.2,
        pitch: avatarData.voice?.pitch || 1,
        lang: avatarData.voice?.lang || 'en-US'
      },
      systemInstruction: avatarData.systemInstruction || null,
      personalityProfileId: avatarData.personalityProfileId || null,
      customRoleData: avatarData.customRoleData || null,
      traits: avatarData.traits || [],
      conversationStyle: avatarData.conversationStyle || 'casual',
      emotionalTone: avatarData.emotionalTone || 'supportive',
      expertise: avatarData.expertise || [],
      languageLevel: avatarData.languageLevel || 'adaptive',
      culturalContext: avatarData.culturalContext || 'universal',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // If creating a custom avatar with personality data, create a personality profile
    if (avatarData.role === 'Custom' && avatarData.createPersonalityProfile) {
      const personalityData = {
        name: avatarData.name,
        role: 'Custom',
        personality: avatarData.personality || 'friendly',
        traits: avatarData.traits || [],
        customInstructions: avatarData.customInstructions || '',
        conversationStyle: avatarData.conversationStyle || 'casual',
        emotionalTone: avatarData.emotionalTone || 'supportive',
        expertise: avatarData.expertise || [],
        languageLevel: avatarData.languageLevel || 'adaptive',
        culturalContext: avatarData.culturalContext || 'universal'
      };

      const profile = aiContentManager.createPersonalityProfile(
        `avatar-${newAvatar.id}`,
        personalityData
      );
      newAvatar.personalityProfileId = profile.id;
    }

    setAvatars(prev => [...prev, newAvatar]);
    return newAvatar;
  }, []);

  // Create avatar from template
  const createAvatarFromTemplate = useCallback((templateName, customizations = {}) => {
    const template = CUSTOM_ROLE_TEMPLATES[templateName];
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    const avatarData = {
      name: customizations.name || template.name,
      role: 'Custom',
      imageUrl: customizations.imageUrl || null,
      createPersonalityProfile: true,
      personality: 'friendly',
      customInstructions: template.systemPrompt,
      conversationStyle: customizations.conversationStyle || 'casual',
      emotionalTone: customizations.emotionalTone || 'supportive',
      traits: customizations.traits || [],
      expertise: customizations.expertise || [],
      languageLevel: customizations.languageLevel || 'adaptive',
      culturalContext: customizations.culturalContext || 'universal',
      ...customizations
    };

    return createAvatar(avatarData);
  }, [createAvatar]);

  // Update an existing avatar
  const updateAvatar = useCallback((avatarId, updates) => {
    setAvatars(prev => prev.map(avatar => {
      if (avatar.id !== avatarId) return avatar;

      const updatedAvatar = { ...avatar, ...updates, updatedAt: Date.now() };

      // If updating personality data for a custom avatar, update the personality profile
      if (avatar.personalityProfileId && updates.personalityData) {
        aiContentManager.updatePersonalityProfile(
          avatar.personalityProfileId,
          updates.personalityData
        );
      }

      return updatedAvatar;
    }));
  }, []);

  // Delete an avatar
  const deleteAvatar = useCallback((avatarId) => {
    const avatar = avatars.find(a => a.id === avatarId);
    
    // Delete associated personality profile
    if (avatar && avatar.personalityProfileId) {
      aiContentManager.deletePersonalityProfile(avatar.personalityProfileId);
    }

    setAvatars(prev => prev.filter(avatar => avatar.id !== avatarId));
    
    // If the deleted avatar was active, clear the active avatar
    if (activeAvatarId === avatarId) {
      setActiveAvatarId(null);
    }
  }, [avatars, activeAvatarId]);

  // Set active avatar
  const setActiveAvatar = useCallback((avatarId) => {
    setActiveAvatarId(avatarId);
  }, []);

  // Get active avatar
  const getActiveAvatar = useCallback(() => {
    return avatars.find(avatar => avatar.id === activeAvatarId) || null;
  }, [avatars, activeAvatarId]);

  // Get system instruction for active avatar or role
  const getSystemInstructionForAvatar = useCallback((role = null) => {
    const activeAvatar = getActiveAvatar();
    
    if (activeAvatar) {
      // If avatar has a personality profile, use it
      if (activeAvatar.personalityProfileId) {
        return getPersonalitySystemInstruction(
          activeAvatar.personalityProfileId,
          activeAvatar.name
        );
      }
      
      // If avatar has custom system instruction, use it
      if (activeAvatar.systemInstruction) {
        return activeAvatar.systemInstruction;
      }
      
      // Otherwise, build from role with avatar name
      const roleInstruction = getSystemInstruction(
        activeAvatar.role,
        activeAvatar.customRoleData?.customInstructions,
        activeAvatar.name
      );
      return roleInstruction;
    }
    
    // No active avatar, use role-based instruction
    return getSystemInstruction(role || 'Tutor');
  }, [getActiveAvatar]);

  // Get avatar personality data
  const getAvatarPersonality = useCallback((avatarId) => {
    const avatar = avatars.find(a => a.id === avatarId);
    if (!avatar || !avatar.personalityProfileId) return null;
    
    return aiContentManager.getPersonalityProfile(avatar.personalityProfileId);
  }, [avatars]);

  // Update avatar personality
  const updateAvatarPersonality = useCallback((avatarId, personalityUpdates) => {
    const avatar = avatars.find(a => a.id === avatarId);
    if (!avatar || !avatar.personalityProfileId) return;
    
    aiContentManager.updatePersonalityProfile(
      avatar.personalityProfileId,
      personalityUpdates
    );
  }, [avatars]);

  // Get available role templates
  const getRoleTemplates = useCallback(() => {
    return Object.entries(CUSTOM_ROLE_TEMPLATES).map(([key, template]) => ({
      id: key,
      name: template.name,
      description: template.description,
      systemPrompt: template.systemPrompt
    }));
  }, []);

  // Upload and process audio file for avatar
  const uploadAvatarAudio = useCallback((file) => {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('audio/')) {
        reject(new Error('Please select a valid audio file'));
        return;
      }

      // Create object URL for the audio file
      const audioUrl = URL.createObjectURL(file);
      
      // You could add audio processing here if needed
      // For now, we just store the URL for playback
      resolve(audioUrl);
    });
  }, []);

  // Play avatar sample audio
  const playAvatarSample = useCallback((avatarId) => {
    const avatar = avatars.find(a => a.id === avatarId);
    if (avatar && avatar.sampleAudioUrl) {
      const audio = new Audio(avatar.sampleAudioUrl);
      audio.play().catch(error => {
        console.error('Error playing audio sample:', error);
      });
    }
  }, [avatars]);

  // Clear active avatar
  const clearActiveAvatar = useCallback(() => {
    setActiveAvatarId(null);
  }, []);

  const value = {
    avatars,
    activeAvatarId,
    createAvatar,
    createAvatarFromTemplate,
    updateAvatar,
    deleteAvatar,
    setActiveAvatar,
    getActiveAvatar,
    getSystemInstructionForAvatar,
    getAvatarPersonality,
    updateAvatarPersonality,
    getRoleTemplates,
    uploadAvatarAudio,
    playAvatarSample,
    clearActiveAvatar
  };

  return (
    <AvatarContext.Provider value={value}>
      {children}
    </AvatarContext.Provider>
  );
};
