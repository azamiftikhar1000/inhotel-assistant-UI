import { CoreMessage } from 'ai';
import { nextActionSchema } from '../schema/next-action';
import { getModel } from '../utils';

// Decide whether inquiry is required for the user input
export async function taskManager(messages: CoreMessage[], hotel_id?: string, assistant_id?: string) {
  try {
    const question = messages.map(message => message.content).join(' ');

    console.log('taskManager payload', JSON.stringify({ question }));

    const response = await fetch('https://inhotel-workflow.replit.app/api/v1/prediction/79b52a43-d9a3-4994-833e-f9b75d0072a6', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);

   
    const responseBody = await response.text();
    console.log('Response body:', responseBody);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = JSON.parse(responseBody);
    console.log('taskManager result', result);
    return result;
  } catch (error) {
    console.error('taskManager error', error);
    return null;
  }
}

