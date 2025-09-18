import React from 'react';
import { AI_NAME , AI_INTRO } from '../constants.js';
import SpeakerOnIcon from './icons/SpeakerOnIcon.jsx';
import SpeakerOffIcon from './icons/SpeakerOffIcon.jsx';
import VoiceSelector from './VoiceSelector.jsx';
import RoleSelector from './RoleSelector.jsx';

const Avatar = ({ 
    isLoading, 
    isTtsEnabled, 
    onToggleTts,
    voices,
    selectedVoiceURI,
    onVoiceChange,
    roles,
    selectedRole,
    onRoleChange
}) => {
    const avatarUrl = AI_INTRO[selectedRole]?.avatar || AI_INTRO.Tutor.avatar;
    const avatarName = AI_INTRO[selectedRole]?.name || AI_NAME;
    return (
        <div className="flex flex-col items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="relative w-full flex justify-center">
                <div className="relative">
                    <img
                        src={avatarUrl}
                        alt={AI_NAME}
                        className="w-24 h-24 rounded-full shadow-lg border-4 border-white"
                    />
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                            <div className="w-6 h-6 border-4 border-t-transparent border-blue-300 rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
                 <div className="absolute top-0 right-2 flex items-center space-x-2">
                    <RoleSelector
                        roles={roles}
                        selectedRole={selectedRole}
                        onRoleChange={onRoleChange}
                        disabled={isLoading}
                    />
                    {isTtsEnabled && voices.length > 0 && selectedVoiceURI && (
                        <VoiceSelector 
                            voices={voices}
                            selectedVoiceURI={selectedVoiceURI}
                            onVoiceChange={onVoiceChange}
                            disabled={isLoading}
                        />
                    )}
                    <button 
                        onClick={onToggleTts}
                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-full"
                        aria-label={isTtsEnabled ? 'Disable text-to-speech' : 'Enable text-to-speech'}
                    >
                        {isTtsEnabled ? <SpeakerOnIcon className="w-6 h-6" /> : <SpeakerOffIcon className="w-6 h-6" />}
                    </button>
                </div>
            </div>
            <h2 className="text-xl font-bold mt-3 text-gray-800">{selectedRole}</h2>
            <p className="text-sm text-gray-500">Your Personal English Practice Partner</p>
        </div>
    );
};

export default Avatar;
