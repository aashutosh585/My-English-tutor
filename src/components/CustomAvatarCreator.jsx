import React, { useState } from 'react';
import { useAvatar } from '../contexts/AvatarContext.jsx';
import { CUSTOM_ROLE_TEMPLATES } from '../constants.js';

const CustomAvatarCreator = ({ onClose, onCreated }) => {
  const { createAvatar, createAvatarFromTemplate, getRoleTemplates } = useAvatar();
  
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    role: 'Custom',
    personality: 'friendly',
    conversationStyle: 'casual',
    emotionalTone: 'supportive',
    traits: [],
    expertise: [],
    customInstructions: '',
    languageLevel: 'adaptive',
    culturalContext: 'universal'
  });

  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [step, setStep] = useState(1); // 1: Template selection, 2: Customization

  const personalityOptions = [
    { value: 'friendly', label: 'Friendly & Approachable' },
    { value: 'professional', label: 'Professional & Formal' },
    { value: 'playful', label: 'Playful & Fun' },
    { value: 'nurturing', label: 'Nurturing & Caring' },
    { value: 'energetic', label: 'Energetic & Enthusiastic' },
    { value: 'wise', label: 'Wise & Thoughtful' }
  ];

  const conversationStyles = [
    { value: 'casual', label: 'Casual & Relaxed' },
    { value: 'formal', label: 'Formal & Professional' },
    { value: 'playful', label: 'Playful & Humorous' },
    { value: 'nurturing', label: 'Nurturing & Supportive' }
  ];

  const emotionalTones = [
    { value: 'supportive', label: 'Supportive & Encouraging' },
    { value: 'energetic', label: 'Energetic & Enthusiastic' },
    { value: 'calm', label: 'Calm & Peaceful' },
    { value: 'motivational', label: 'Motivational & Inspiring' }
  ];

  const languageLevels = [
    { value: 'beginner', label: 'Beginner (Simple language)' },
    { value: 'intermediate', label: 'Intermediate (Moderate complexity)' },
    { value: 'advanced', label: 'Advanced (Complex language)' },
    { value: 'adaptive', label: 'Adaptive (Matches user level)' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTraitsChange = (trait) => {
    setFormData(prev => ({
      ...prev,
      traits: prev.traits.includes(trait)
        ? prev.traits.filter(t => t !== trait)
        : [...prev.traits, trait]
    }));
  };

  const handleExpertiseChange = (expertise) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter(e => e !== expertise)
        : [...prev.expertise, expertise]
    }));
  };

  const handleTemplateSelect = (templateId) => {
    if (templateId === 'custom') {
      setSelectedTemplate('');
      setStep(2);
    } else {
      setSelectedTemplate(templateId);
      const template = CUSTOM_ROLE_TEMPLATES[templateId];
      if (template) {
        setFormData(prev => ({
          ...prev,
          name: template.name,
          customInstructions: template.systemPrompt
        }));
      }
      setStep(2);
    }
  };

  const handleCreateAvatar = async () => {
    try {
      let avatar;
      
      if (selectedTemplate && selectedTemplate !== 'custom') {
        // Create from template with customizations
        avatar = createAvatarFromTemplate(selectedTemplate, {
          ...formData,
          createPersonalityProfile: true
        });
      } else {
        // Create completely custom avatar
        avatar = createAvatar({
          ...formData,
          createPersonalityProfile: true
        });
      }

      onCreated?.(avatar);
      onClose?.();
    } catch (error) {
      console.error('Failed to create avatar:', error);
      alert('Failed to create avatar. Please try again.');
    }
  };

  const availableTraits = [
    'Patient', 'Encouraging', 'Humorous', 'Wise', 'Energetic', 'Calm',
    'Supportive', 'Creative', 'Analytical', 'Empathetic', 'Confident', 'Gentle'
  ];

  const availableExpertise = [
    'Grammar', 'Pronunciation', 'Vocabulary', 'Business English', 'Conversation',
    'Writing', 'Literature', 'Culture', 'Technology', 'Science', 'Arts', 'Sports'
  ];

  if (step === 1) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800">Create Custom AI Avatar</h2>
            <p className="text-slate-600 mt-2">Choose a template or start from scratch</p>
          </div>

          <div className="p-6">
            <div className="grid gap-4">
              {/* Custom Option */}
              <button
                onClick={() => handleTemplateSelect('custom')}
                className="p-4 border-2 border-dashed border-sky-300 rounded-xl hover:border-sky-500 hover:bg-sky-50 transition-all text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-violet-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold">AI</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Create from Scratch</h3>
                    <p className="text-sm text-slate-600">Build a completely custom AI personality</p>
                  </div>
                </div>
              </button>

              {/* Template Options */}
              {Object.entries(CUSTOM_ROLE_TEMPLATES).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => handleTemplateSelect(key)}
                  className="p-4 border border-slate-200 rounded-xl hover:border-sky-300 hover:bg-slate-50 transition-all text-left"
                >
                  <h3 className="font-semibold text-slate-800">{template.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">{template.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">Customize Your AI Avatar</h2>
          <p className="text-slate-600 mt-2">
            {selectedTemplate ? `Based on ${CUSTOM_ROLE_TEMPLATES[selectedTemplate]?.name} template` : 'Custom AI personality'}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Avatar Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Enter avatar name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Avatar Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Personality Settings */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Personality Type
              </label>
              <select
                name="personality"
                value={formData.personality}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                {personalityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Conversation Style
              </label>
              <select
                name="conversationStyle"
                value={formData.conversationStyle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                {conversationStyles.map(style => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Emotional Tone
              </label>
              <select
                name="emotionalTone"
                value={formData.emotionalTone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                {emotionalTones.map(tone => (
                  <option key={tone.value} value={tone.value}>
                    {tone.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Language Level
              </label>
              <select
                name="languageLevel"
                value={formData.languageLevel}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                {languageLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Personality Traits */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Personality Traits
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTraits.map(trait => (
                <button
                  key={trait}
                  type="button"
                  onClick={() => handleTraitsChange(trait)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    formData.traits.includes(trait)
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {trait}
                </button>
              ))}
            </div>
          </div>

          {/* Expertise Areas */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Areas of Expertise
            </label>
            <div className="flex flex-wrap gap-2">
              {availableExpertise.map(expertise => (
                <button
                  key={expertise}
                  type="button"
                  onClick={() => handleExpertiseChange(expertise)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    formData.expertise.includes(expertise)
                      ? 'bg-violet-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {expertise}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Instructions */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Custom Instructions (Optional)
            </label>
            <textarea
              name="customInstructions"
              value={formData.customInstructions}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Add any specific instructions for how this AI should behave..."
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-between">
          <button
            onClick={() => setStep(1)}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
          >
            ← Back to Templates
          </button>
          <div className="space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateAvatar}
              disabled={!formData.name.trim()}
              className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Avatar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAvatarCreator;