import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
let chat = null;

export const startNewChat = (systemInstruction) => {
    chat = ai.chats.create({
        model: 'gemini-1.5-flash',
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: 'application/json',
        },
    });
};

export const sendMessageToAI = async (message) => {
    if (!chat) {
        throw new Error("Chat not initialized. Call startNewChat first.");
    }
    
    try {
        const result = await chat.sendMessage({ message: message });
        const text = result.text.trim();
        
        // Sanitize the response text to ensure it is valid JSON
        let jsonStr = text;
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }

        const parsedResponse = JSON.parse(jsonStr);
        return parsedResponse;
    } catch (error) {
        console.error("Error communicating with Gemini API:", error);
        
        // Handle specific network errors
        if (error.message.includes('ERR_CERT_AUTHORITY_INVALID') || 
            error.message.includes('Failed to fetch')) {
            return {
                correction: null,
                explanation: "Network connection issue. Please check your internet connection and API key.",
                response: "I'm having trouble connecting to the AI service. Please try again in a moment.",
            };
        }
        
        // Fallback response in case of parsing or API error
        return {
            correction: null,
            explanation: "Sorry, I encountered an error. Let's try that again.",
            response: "Could you please rephrase that?",
        };
    }
};
