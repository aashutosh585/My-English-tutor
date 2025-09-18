import { GoogleGenAI } from "@google/genai";

if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

let chat = null;

export const startNewChat = (systemInstruction) => {
    try {
        chat = ai.chats.create({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction: systemInstruction
            },
            history: []
        });
    } catch (error) {
        console.error("Error starting new chat:", error);
        throw new Error("Failed to initialize chat session");
    }
};

export const sendMessageToAI = async (message) => {
    if (!chat) {
        throw new Error("Chat not initialized. Call startNewChat first.");
    }
    
    try {
        const stream = await chat.sendMessageStream({
            message: message
        });
        
        let fullResponse = '';
        for await (const chunk of stream) {
            if (chunk.text) {
                fullResponse += chunk.text;
            }
        }
        
        const responseText = fullResponse.trim();
        
        // Clean up the response text to ensure it's valid JSON
        let jsonStr = responseText;
        
        // Remove any markdown code fences if present
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }
        
        // Remove any extra text before or after JSON
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonStr = jsonMatch[0];
        }
        
        try {
            const parsedResponse = JSON.parse(jsonStr);
            
            // Validate the response has the required fields
            if (typeof parsedResponse === 'object' && parsedResponse.hasOwnProperty('response')) {
                return {
                    correction: parsedResponse.correction || null,
                    explanation: parsedResponse.explanation || null,
                    response: parsedResponse.response || "I apologize, but I didn't receive a proper response. Could you please try again?"
                };
            }
        } catch (parseError) {
            console.error("JSON parsing error:", parseError);
        }
        
        // If JSON parsing fails, treat as plain text response
        return {
            correction: null,
            explanation: null,
            response: responseText || "I apologize, but I didn't receive a proper response. Could you please try again?"
        };
        
    } catch (error) {
        console.error("Error communicating with Gemini API:", error);
        
        // Handle specific network errors
        if (error.message.includes('ERR_CERT_AUTHORITY_INVALID') || 
            error.message.includes('Failed to fetch') ||
            error.message.includes('NetworkError') ||
            error.code === 'NETWORK_ERROR') {
            return {
                correction: null,
                explanation: "Network connection issue. Please check your internet connection and API key.",
                response: "I'm having trouble connecting to the AI service. Please try again in a moment.",
            };
        }
        
        // Handle API key errors
        if (error.message.includes('API key') || 
            error.message.includes('authentication') ||
            error.code === 'UNAUTHENTICATED') {
            return {
                correction: null,
                explanation: "API key issue. Please check your configuration.",
                response: "There seems to be an authentication issue. Please check your API key.",
            };
        }
        
        // Fallback response for other errors
        return {
            correction: null,
            explanation: "Sorry, I encountered an error. Let's try that again.",
            response: "Could you please rephrase that?",
        };
    }
};
