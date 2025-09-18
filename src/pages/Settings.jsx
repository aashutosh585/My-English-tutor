import React, { useState } from 'react';
import { Link } from 'react-router';
import { useVoice } from '../contexts/VoiceContext.jsx';

const Settings = () => {
  const {
    voices,
    isTtsEnabled,
    selectedVoiceURI,
    rate,
    pitch,
    lang,
    toggleTts,
    updateVoiceSettings,
    speak,
    cancel
  } = useVoice();

  const [testText, setTestText] = useState("Hello! This is a test of the text-to-speech voice settings.");

  const handleVoiceTest = () => {
    if (testText.trim()) {
      speak(testText);
    }
  };

  const handleStopSpeech = () => {
    cancel();
  };

  const handleVoiceChange = (voiceURI) => {
    updateVoiceSettings({ voiceURI });
  };

  const handleRateChange = (newRate) => {
    updateVoiceSettings({ rate: parseFloat(newRate) });
  };

  const handlePitchChange = (newPitch) => {
    updateVoiceSettings({ pitch: parseFloat(newPitch) });
  };

  const handleLangChange = (newLang) => {
    updateVoiceSettings({ lang: newLang });
  };

  const englishVoices = voices.filter(v => v.lang.startsWith('en-'));
  const otherVoices = voices.filter(v => !v.lang.startsWith('en-'));

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
              <Link to="/avatars" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
                Avatars
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Configure your voice and speech preferences</p>
        </div>

        <div className="space-y-8">
          {/* Text-to-Speech Settings */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Text-to-Speech Settings</h2>
            
            {/* TTS Toggle */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Enable Text-to-Speech</h3>
                  <p className="text-sm text-gray-600">AI responses will be spoken aloud</p>
                </div>
                <button
                  onClick={toggleTts}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    isTtsEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isTtsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {isTtsEnabled && (
              <>
                {/* Voice Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Voice
                  </label>
                  
                  {/* English Voices */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">English Voices</h4>
                    <select
                      value={selectedVoiceURI || ''}
                      onChange={(e) => handleVoiceChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select an English voice</option>
                      {englishVoices.map(voice => (
                        <option key={voice.voiceURI} value={voice.voiceURI}>
                          {voice.name} ({voice.lang}) {voice.default ? '(Default)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Other Voices */}
                  {otherVoices.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Other Languages</h4>
                      <select
                        value={selectedVoiceURI || ''}
                        onChange={(e) => handleVoiceChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select a voice</option>
                        {otherVoices.map(voice => (
                          <option key={voice.voiceURI} value={voice.voiceURI}>
                            {voice.name} ({voice.lang})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Speech Rate */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speech Rate: {rate}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={rate}
                    onChange={(e) => handleRateChange(e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Slow (0.5x)</span>
                    <span>Normal (1x)</span>
                    <span>Fast (2x)</span>
                  </div>
                </div>

                {/* Speech Pitch */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speech Pitch: {pitch}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={pitch}
                    onChange={(e) => handlePitchChange(e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low (0.5)</span>
                    <span>Normal (1)</span>
                    <span>High (2)</span>
                  </div>
                </div>

                {/* Language Setting */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Language
                  </label>
                  <select
                    value={lang}
                    onChange={(e) => handleLangChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="en-US">English (US)</option>
                    <option value="en-GB">English (UK)</option>
                    <option value="en-AU">English (Australia)</option>
                    <option value="en-CA">English (Canada)</option>
                  </select>
                </div>

                {/* Voice Test */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Test Voice</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Test Text
                      </label>
                      <textarea
                        value={testText}
                        onChange={(e) => setTestText(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter text to test the voice..."
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={handleVoiceTest}
                        disabled={!testText.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-md font-medium"
                      >
                        🔊 Test Voice
                      </button>
                      <button
                        onClick={handleStopSpeech}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium"
                      >
                        ⏹️ Stop
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Speech Recognition Settings */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Speech Recognition</h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Speech recognition uses your browser's built-in Web Speech API. 
                      Make sure to allow microphone access when prompted.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Supported Browsers</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✅ Chrome</li>
                    <li>✅ Edge</li>
                    <li>✅ Safari (limited)</li>
                    <li>❌ Firefox</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Tips for Better Recognition</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Speak clearly and at normal pace</li>
                    <li>• Use a quiet environment</li>
                    <li>• Check microphone permissions</li>
                    <li>• Ensure good microphone quality</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Audio Transcription Settings */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Audio Transcription</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    File Transcription Not Available
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Audio file transcription requires external API services (like OpenAI Whisper or AssemblyAI) 
                    that need to be configured separately. Currently, only microphone input is supported 
                    through the browser's Web Speech API.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Data & Privacy */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Data & Privacy</h2>
            
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Local Storage Only
                    </h3>
                    <p className="text-sm text-green-700 mt-1">
                      All your avatars, conversations, and settings are stored locally in your browser. 
                      No data is sent to external servers except for AI conversations through the Gemini API.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">What's Stored Locally</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Created avatars and their settings</li>
                    <li>• Chat conversation history</li>
                    <li>• Voice and speech preferences</li>
                    <li>• Uploaded images and audio files</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">What's Sent to AI</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Your text messages only</li>
                    <li>• System instructions for AI persona</li>
                    <li>• Previous conversation context</li>
                    <li>• No audio files or personal data</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;