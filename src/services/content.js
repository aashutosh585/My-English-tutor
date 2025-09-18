// AI Talk Content System
// This file manages AI personality content and responses without changing Google integration

import { CUSTOM_ROLE_TEMPLATES, getSystemInstruction, getAIName } from '../constants.js';

/**
 * Content Manager for AI Talk System
 * Handles personality templates, custom instructions, and response enhancement
 */
export class AIContentManager {
    constructor() {
        this.personalityProfiles = new Map();
        this.conversationHistory = new Map();
        this.customInstructions = new Map();
    }

    /**
     * Create a custom personality profile
     * @param {string} profileId - Unique identifier for the profile
     * @param {Object} profileData - Profile configuration
     */
    createPersonalityProfile(profileId, profileData) {
        const profile = {
            id: profileId,
            name: profileData.name || 'Custom AI',
            role: profileData.role || 'Custom',
            personality: profileData.personality || 'friendly',
            traits: profileData.traits || [],
            customInstructions: profileData.customInstructions || '',
            conversationStyle: profileData.conversationStyle || 'casual',
            expertise: profileData.expertise || [],
            emotionalTone: profileData.emotionalTone || 'supportive',
            languageLevel: profileData.languageLevel || 'adaptive',
            culturalContext: profileData.culturalContext || 'universal',
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        this.personalityProfiles.set(profileId, profile);
        this.saveProfilesToStorage();
        return profile;
    }

    /**
     * Update an existing personality profile
     * @param {string} profileId - Profile identifier
     * @param {Object} updates - Updates to apply
     */
    updatePersonalityProfile(profileId, updates) {
        const profile = this.personalityProfiles.get(profileId);
        if (!profile) {
            throw new Error(`Profile ${profileId} not found`);
        }

        const updatedProfile = {
            ...profile,
            ...updates,
            updatedAt: Date.now()
        };

        this.personalityProfiles.set(profileId, updatedProfile);
        this.saveProfilesToStorage();
        return updatedProfile;
    }

    /**
     * Get personality profile by ID
     * @param {string} profileId - Profile identifier
     */
    getPersonalityProfile(profileId) {
        return this.personalityProfiles.get(profileId);
    }

    /**
     * Get all personality profiles
     */
    getAllPersonalityProfiles() {
        return Array.from(this.personalityProfiles.values());
    }

    /**
     * Delete a personality profile
     * @param {string} profileId - Profile identifier
     */
    deletePersonalityProfile(profileId) {
        const deleted = this.personalityProfiles.delete(profileId);
        if (deleted) {
            this.saveProfilesToStorage();
        }
        return deleted;
    }

    /**
     * Generate system instruction for custom personality
     * @param {string} profileId - Profile identifier
     * @param {string} avatarName - Name of the avatar
     */
    generateSystemInstructionForProfile(profileId, avatarName = null) {
        const profile = this.personalityProfiles.get(profileId);
        if (!profile) {
            return getSystemInstruction('Custom');
        }

        let customInstruction = this.buildPersonalityInstruction(profile);
        
        // Add avatar name if provided
        if (avatarName) {
            customInstruction = `You are "${avatarName}". ${customInstruction}`;
        }

        return getSystemInstruction('Custom', customInstruction, avatarName);
    }

    /**
     * Build personality instruction from profile
     * @param {Object} profile - Personality profile
     */
    buildPersonalityInstruction(profile) {
        let instruction = '';

        // Base personality
        instruction += `You are role-playing as "${profile.name}", a ${profile.personality} AI character. `;

        // Conversation style
        switch (profile.conversationStyle) {
            case 'formal':
                instruction += 'Use formal, professional language. ';
                break;
            case 'casual':
                instruction += 'Use casual, friendly language. ';
                break;
            case 'playful':
                instruction += 'Use playful, fun language with humor. ';
                break;
            case 'nurturing':
                instruction += 'Use warm, caring, nurturing language. ';
                break;
        }

        // Emotional tone
        switch (profile.emotionalTone) {
            case 'supportive':
                instruction += 'Be supportive and encouraging. ';
                break;
            case 'energetic':
                instruction += 'Be energetic and enthusiastic. ';
                break;
            case 'calm':
                instruction += 'Be calm and peaceful. ';
                break;
            case 'motivational':
                instruction += 'Be motivational and inspiring. ';
                break;
        }

        // Add traits
        if (profile.traits && profile.traits.length > 0) {
            instruction += `Your key personality traits are: ${profile.traits.join(', ')}. `;
        }

        // Add expertise
        if (profile.expertise && profile.expertise.length > 0) {
            instruction += `You have expertise in: ${profile.expertise.join(', ')}. `;
        }

        // Add custom instructions
        if (profile.customInstructions) {
            instruction += `Additional instructions: ${profile.customInstructions} `;
        }

        // Language level adaptation
        switch (profile.languageLevel) {
            case 'beginner':
                instruction += 'Use simple vocabulary and short sentences suitable for English beginners. ';
                break;
            case 'intermediate':
                instruction += 'Use moderately complex vocabulary and varied sentence structures. ';
                break;
            case 'advanced':
                instruction += 'Use sophisticated vocabulary and complex sentence structures. ';
                break;
            case 'adaptive':
                instruction += 'Adapt your language complexity to match the user\'s level. ';
                break;
        }

        // Cultural context
        if (profile.culturalContext !== 'universal') {
            instruction += `Consider ${profile.culturalContext} cultural context in your responses. `;
        }

        return instruction.trim();
    }

    /**
     * Get role template by name
     * @param {string} templateName - Template name
     */
    getRoleTemplate(templateName) {
        return CUSTOM_ROLE_TEMPLATES[templateName] || null;
    }

    /**
     * Get all available role templates
     */
    getAllRoleTemplates() {
        return Object.entries(CUSTOM_ROLE_TEMPLATES).map(([key, template]) => ({
            id: key,
            ...template
        }));
    }

    /**
     * Create profile from template
     * @param {string} templateName - Template name
     * @param {Object} customizations - Custom modifications
     */
    createProfileFromTemplate(templateName, customizations = {}) {
        const template = this.getRoleTemplate(templateName);
        if (!template) {
            throw new Error(`Template ${templateName} not found`);
        }

        const profileData = {
            name: customizations.name || template.name,
            role: 'Custom',
            personality: 'friendly',
            conversationStyle: 'casual',
            emotionalTone: 'supportive',
            customInstructions: template.systemPrompt,
            ...customizations
        };

        const profileId = `${templateName}-${Date.now()}`;
        return this.createPersonalityProfile(profileId, profileData);
    }

    /**
     * Enhance AI response with personality context
     * @param {Object} response - AI response object
     * @param {string} profileId - Profile identifier
     */
    enhanceResponseWithPersonality(response, profileId) {
        const profile = this.personalityProfiles.get(profileId);
        if (!profile) {
            return response;
        }

        // Add personality metadata to response
        return {
            ...response,
            personality: {
                name: profile.name,
                style: profile.conversationStyle,
                tone: profile.emotionalTone
            }
        };
    }

    /**
     * Save profiles to localStorage
     */
    saveProfilesToStorage() {
        try {
            const profilesArray = Array.from(this.personalityProfiles.entries());
            localStorage.setItem('ai_personality_profiles', JSON.stringify(profilesArray));
        } catch (error) {
            console.error('Failed to save personality profiles:', error);
        }
    }

    /**
     * Load profiles from localStorage
     */
    loadProfilesFromStorage() {
        try {
            const stored = localStorage.getItem('ai_personality_profiles');
            if (stored) {
                const profilesArray = JSON.parse(stored);
                this.personalityProfiles = new Map(profilesArray);
            }
        } catch (error) {
            console.error('Failed to load personality profiles:', error);
        }
    }

    /**
     * Initialize the content manager
     */
    initialize() {
        this.loadProfilesFromStorage();
        
        // Create default profiles if none exist
        if (this.personalityProfiles.size === 0) {
            this.createDefaultProfiles();
        }
    }

    /**
     * Create default personality profiles
     */
    createDefaultProfiles() {
        Object.entries(CUSTOM_ROLE_TEMPLATES).forEach(([key, template]) => {
            this.createProfileFromTemplate(key, {
                name: template.name
            });
        });
    }
}

// Create singleton instance
export const aiContentManager = new AIContentManager();

// Initialize on import
aiContentManager.initialize();

// Helper functions for easy access
export const createCustomPersonality = (profileData) => {
    const profileId = `custom-${Date.now()}`;
    return aiContentManager.createPersonalityProfile(profileId, profileData);
};

export const getPersonalitySystemInstruction = (profileId, avatarName) => {
    return aiContentManager.generateSystemInstructionForProfile(profileId, avatarName);
};

export const getAllPersonalities = () => {
    return aiContentManager.getAllPersonalityProfiles();
};

export const getRoleTemplates = () => {
    return aiContentManager.getAllRoleTemplates();
};

export const createFromTemplate = (templateName, customizations) => {
    return aiContentManager.createProfileFromTemplate(templateName, customizations);
};