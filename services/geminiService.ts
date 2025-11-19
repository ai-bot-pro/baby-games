import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

let chatSession: Chat | null = null;
let ai: GoogleGenAI | null = null;

export const initializeGemini = () => {
  // The API key must be obtained exclusively from the environment variable process.env.API_KEY.
  // Assume this variable is pre-configured, valid, and accessible.
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const startNewGame = async (): Promise<string> => {
  if (!ai) initializeGemini();
  if (!ai) throw new Error("AI not initialized");

  try {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 1.0, // High creativity for persona
      },
    });

    const response = await chatSession.sendMessage({ message: "开始游戏" });
    return response.text || "游戏启动失败，请重试。";
  } catch (error) {
    console.error("Error starting game:", error);
    return "哎呀，点点老师好像掉线了，请检查网络设置哦！(API Error)";
  }
};

export const sendMessageToGemini = async (userMessage: string): Promise<string> => {
  if (!chatSession) {
     // If session lost, try to restart or error
     return "游戏还没开始呢，请刷新页面重新开始！";
  }

  try {
    const response = await chatSession.sendMessage({ message: userMessage });
    return response.text || "点点老师正在思考...";
  } catch (error) {
    console.error("Error sending message:", error);
    return "哎呀，点点老师没有听清楚，再说一遍好吗？(Network Error)";
  }
};