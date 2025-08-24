export interface MessagesResponse {
  messages: Array<{
    id: string;
    content: string;
    isAgent: boolean;
    timestamp: string;
  }>;
}

export interface SessionResponse {
  sessionId: string;
}

/**
 * Utility function to delay execution
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry operation with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>, 
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        console.error(`Operation failed after ${maxRetries + 1} attempts:`, error);
        throw lastError;
      }
      
      // Exponential backoff: 1s, 2s, 4s, 8s...
      const delayTime = baseDelay * Math.pow(2, attempt);
      console.log(`Retry attempt ${attempt + 1}/${maxRetries + 1} in ${delayTime}ms...`);
      await delay(delayTime);
    }
  }
  
  throw lastError!;
}

export function parseHashtags(response: string): string[] {
    const hashtagMatches = response.match(/#\w+/g);
    return hashtagMatches ? hashtagMatches.slice(0, 10) : [];
  }

/**
 * Wait for agent response with progressive polling
 */
export async function waitForAgentResponse(
  elizaosUrl: string,
  sessionId: string, 
  maxAttempts: number = 120
): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Progressive delay: start with 1s, increase to 2s after 30 attempts
    const delayTime = attempt < 30 ? 1000 : 2000;
    await delay(delayTime);

    try {
      const messagesResponse = await fetch(`${elizaosUrl}/api/messaging/sessions/${sessionId}/messages`);
      if (!messagesResponse.ok) {
        continue;
      }

      const messagesData = await messagesResponse.json() as MessagesResponse;
      const agentMessages = messagesData.messages.filter((msg: any) => msg.isAgent);

      if (agentMessages.length > 0) {
        const lastMessage = agentMessages[agentMessages.length - 1];
        if (lastMessage.content && lastMessage.content.trim()) {
          return lastMessage.content;
        }
      }
    } catch (error) {
      // Continue polling even if there's a network error
      continue;
    }
  }

  throw new Error('Timeout waiting for agent response');
}

