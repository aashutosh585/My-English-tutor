// Storage service for localStorage with namespace
const STORAGE_PREFIX = 'myet:';

export const storageService = {
  // Generic methods
  set(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  clear() {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(STORAGE_PREFIX))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // Specific storage methods
  getAvatars() {
    return this.get('avatars', []);
  },

  setAvatars(avatars) {
    this.set('avatars', avatars);
  },

  getActiveAvatarId() {
    return this.get('activeAvatarId', null);
  },

  setActiveAvatarId(id) {
    this.set('activeAvatarId', id);
  },

  getChatSessions() {
    return this.get('chatSessions', []);
  },

  setChatSessions(sessions) {
    this.set('chatSessions', sessions);
  },

  getLastSessionId() {
    return this.get('lastSessionId', null);
  },

  setLastSessionId(id) {
    this.set('lastSessionId', id);
  },

  getVoicePrefs() {
    return this.get('voicePrefs', {
      isTtsEnabled: true,
      selectedVoiceURI: null,
      rate: 1.2,
      pitch: 1,
      lang: 'en-US'
    });
  },

  setVoicePrefs(prefs) {
    this.set('voicePrefs', prefs);
  },

  // Chat session helpers
  saveSession(session) {
    const sessions = this.getChatSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = { ...session, updatedAt: Date.now() };
    } else {
      sessions.push({ ...session, createdAt: Date.now(), updatedAt: Date.now() });
    }
    
    this.setChatSessions(sessions);
    this.setLastSessionId(session.id);
  },

  getSession(id) {
    const sessions = this.getChatSessions();
    return sessions.find(s => s.id === id) || null;
  },

  getLastSession() {
    const sessions = this.getChatSessions();
    return sessions.sort((a, b) => b.updatedAt - a.updatedAt)[0] || null;
  }
};
