import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAvatar } from '../contexts/AvatarContext.jsx';
import { useVoice } from '../contexts/VoiceContext.jsx';
import { ROLES } from '../constants.js';

const Avatars = () => {
  const navigate = useNavigate();
  const { 
    avatars, 
    activeAvatarId, 
    createAvatar, 
    updateAvatar, 
    deleteAvatar, 
    setActiveAvatar,
    uploadAvatarAudio,
    playAvatarSample 
  } = useAvatar();
  
  const { voices } = useVoice();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Tutor',
    customRole: '',
    imageFile: null,
    logoFile: null,
    audioFile: null,
    voice: {
      selectedVoiceURI: '',
      rate: 1.2,
      pitch: 1,
      lang: 'en-US'
    }
  });

  const handleInputChange = (field, value) => {
    if (field.startsWith('voice.')) {
      const voiceField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        voice: { ...prev.voice, [voiceField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleFileUpload = async (field, file) => {
    if (!file) return;

    if (field === 'audioFile') {
      try {
        const audioUrl = await uploadAvatarAudio(file);
        setFormData(prev => ({ ...prev, audioFile: file, audioUrl }));
      } catch (error) {
        alert(error.message);
      }
    } else {
      // Handle image/logo files
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ 
          ...prev, 
          [field]: file,
          [`${field}Url`]: e.target.result 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const avatarData = {
      name: formData.name,
      role: formData.role === 'Custom' ? formData.customRole : formData.role,
      imageUrl: formData.imageFileUrl || null,
      logoUrl: formData.logoFileUrl || null,
      sampleAudioUrl: formData.audioUrl || null,
      voice: formData.voice
    };

    try {
      if (editingId) {
        updateAvatar(editingId, avatarData);
      } else {
        createAvatar(avatarData);
      }
      
      resetForm();
    } catch (error) {
      alert('Error saving avatar: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: 'Tutor',
      customRole: '',
      imageFile: null,
      logoFile: null,
      audioFile: null,
      voice: {
        selectedVoiceURI: '',
        rate: 1.2,
        pitch: 1,
        lang: 'en-US'
      }
    });
    setShowCreateForm(false);
    setEditingId(null);
  };

  const handleEdit = (avatar) => {
    setFormData({
      name: avatar.name,
      role: ROLES.includes(avatar.role) ? avatar.role : 'Custom',
      customRole: ROLES.includes(avatar.role) ? '' : avatar.role,
      imageFile: null,
      logoFile: null,
      audioFile: null,
      imageFileUrl: avatar.imageUrl,
      logoFileUrl: avatar.logoUrl,
      audioUrl: avatar.sampleAudioUrl,
      voice: avatar.voice
    });
    setEditingId(avatar.id);
    setShowCreateForm(true);
  };

  const handleDelete = (avatarId) => {
    if (confirm('Are you sure you want to delete this avatar?')) {
      deleteAvatar(avatarId);
    }
  };

  const handleSetActive = (avatarId) => {
    setActiveAvatar(avatarId);
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Gossips AI
            </Link>
            <div className="flex space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link to="/chat" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
                Chat
              </Link>
              <Link to="/settings" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Avatars</h1>
            <p className="text-gray-600 mt-2">Create and customize your AI conversation partners</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Create New Avatar
          </button>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Edit Avatar' : 'Create New Avatar'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter avatar name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                {formData.role === 'Custom' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Role
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customRole}
                      onChange={(e) => handleInputChange('customRole', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter custom role"
                    />
                  </div>
                )}

                {/* File Uploads */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('imageFile', e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formData.imageFileUrl && (
                    <img src={formData.imageFileUrl} alt="Preview" className="mt-2 w-16 h-16 rounded-full object-cover" />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('logoFile', e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formData.logoFileUrl && (
                    <img src={formData.logoFileUrl} alt="Logo Preview" className="mt-2 w-16 h-16 rounded object-cover" />
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voice Sample (Optional)
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleFileUpload('audioFile', e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload a voice sample for preview (will not affect TTS voice)
                  </p>
                </div>

                {/* Voice Settings */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TTS Voice
                  </label>
                  <select
                    value={formData.voice.selectedVoiceURI}
                    onChange={(e) => handleInputChange('voice.selectedVoiceURI', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a voice</option>
                    {voices.filter(v => v.lang.startsWith('en-')).map(voice => (
                      <option key={voice.voiceURI} value={voice.voiceURI}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speech Rate: {formData.voice.rate}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={formData.voice.rate}
                    onChange={(e) => handleInputChange('voice.rate', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {editingId ? 'Update Avatar' : 'Create Avatar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Avatars Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {avatars.map(avatar => (
            <div 
              key={avatar.id} 
              className={`bg-white rounded-lg shadow-lg p-6 border-2 ${
                activeAvatarId === avatar.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center mb-4">
                {avatar.imageUrl && (
                  <img 
                    src={avatar.imageUrl} 
                    alt={avatar.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold">{avatar.name}</h3>
                  <p className="text-sm text-gray-600">{avatar.role}</p>
                </div>
              </div>

              {avatar.sampleAudioUrl && (
                <button
                  onClick={() => playAvatarSample(avatar.id)}
                  className="mb-4 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  🔊 Play Voice Sample
                </button>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => handleSetActive(avatar.id)}
                  className={`flex-1 px-3 py-2 rounded text-sm font-medium ${
                    activeAvatarId === avatar.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  }`}
                >
                  {activeAvatarId === avatar.id ? 'Active' : 'Select'}
                </button>
                <button
                  onClick={() => handleEdit(avatar)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(avatar.id)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {avatars.length === 0 && !showCreateForm && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No avatars yet</h3>
            <p className="text-gray-600 mb-6">Create your first AI conversation partner to get started</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Create Your First Avatar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Avatars;