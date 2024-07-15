import { createStreamableUI } from 'ai/rsc';
import { retrieveTool } from './retrieve';
import { searchTool } from './search';
import { videoSearchTool } from './video-search';
import { hotelAssistant } from './hotel-assistant';

export interface ToolProps {
  uiStream: ReturnType<typeof createStreamableUI>;
  fullResponse: string;
  inbox_id?: string; // Optional inbox_id
}

export const getTools = ({ uiStream, fullResponse, inbox_id = '' }: ToolProps) => { // Default inbox_id to empty string
  const tools: any = {
    search: searchTool({
      uiStream,
      fullResponse
    }),
    retrieve: retrieveTool({
      uiStream,
      fullResponse
    }),
    hotelAssistant: hotelAssistant({
      uiStream,
      fullResponse,
      inbox_id // Include inbox_id in the tool properties
    })
  }

  if (process.env.SERPER_API_KEY) {
    tools.videoSearch = videoSearchTool({
      uiStream,
      fullResponse
    })
  }

  return tools
}
