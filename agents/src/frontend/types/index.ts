// API Response Types
export interface SessionResponse {
  sessionId: string;
}

export interface Message {
  content: string;
  isAgent: boolean;
}

export interface MessagesResponse {
  messages: Message[];
}

// Application Types
export interface AnalysisResult {
  hashtags: string[];
  analysis: string;
  signalsResult?: string; // Optional field for blockchain publication result
}

// Global declarations
declare global {
  interface Window {
    ELIZA_CONFIG?: {
      agentId: string;
      apiBase: string;
    };
  }
}
