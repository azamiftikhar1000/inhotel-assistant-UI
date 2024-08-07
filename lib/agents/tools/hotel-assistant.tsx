import { tool } from 'ai';
import { z } from 'zod';
import { createStreamableValue } from 'ai/rsc';
import { hotelAssistantSchema } from '@/lib/schema/hotel-assistant';
import { ToolProps } from '.';

// Start Generation Here
export const hotelAssistant = ({ uiStream, fullResponse, inbox_id = '', hotelAssistantPrompt={}  }: ToolProps) => tool({

  description: hotelAssistantPrompt.description ,
  parameters: z.object({
    query: z.string().describe( hotelAssistantPrompt.parameters)
  })
  ,
  execute: async ({ query }) => {
    let hasError = false;
    const streamResults = createStreamableValue<string>();
    let Result;
    try {
      console.log(`https://inhotel-bda7de42c465.herokuapp.com/chat/get_response?inbox_id=${inbox_id}&user_input=${encodeURIComponent(query)}`);
      const response = await fetch(`https://inhotel-bda7de42c465.herokuapp.com/chat/get_response?inbox_id=${inbox_id}&user_input=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      Result = await response.json();
    } catch (error) {
      console.error('Hotel assistant error:', error);
      hasError = true;
    }

    if (hasError) {
      fullResponse = `An error occurred while searching for videos with "${query}.`;
      uiStream.update(null);
      streamResults.done();
      return Result;
    }

    streamResults.done(JSON.stringify(Result));

    return Result;
  }
});
