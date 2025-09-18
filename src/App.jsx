import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { VoiceProvider } from './contexts/VoiceContext.jsx';
import { AvatarProvider } from './contexts/AvatarContext.jsx';
import { ChatProvider } from './contexts/ChatContext.jsx';
import Landing from './pages/Landing.jsx';
import Chat from './pages/Chat.jsx';
import Avatars from './pages/Avatars.jsx';
import Settings from './pages/Settings.jsx';
import NotFound from './pages/NotFound.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <VoiceProvider>
        <AvatarProvider>
          <ChatProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ChatProvider>
        </AvatarProvider>
      </VoiceProvider>
    </BrowserRouter>
  );
};

export default App;
