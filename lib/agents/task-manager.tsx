import { CoreMessage, generateObject } from 'ai'
import { nextActionSchema } from '../schema/next-action';
import { getModel } from '../utils';

// Decide whether inquiry is required for the user input
export async function taskManager(messages: CoreMessage[], systemPrompt?: string) {
  try {
    
    const response = await fetch('https://inhotel-workflow.replit.app/api/v1/prediction/79b52a43-d9a3-4994-833e-f9b75d0072a6', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: messages.map(message => message.content).join(' ')
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('taskManager result', result);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

