import { Chat } from '@/components/chat'
import { generateId } from 'ai'
import { AI } from './actions'

export const maxDuration = 60

export default async function Page({ searchParams }: { searchParams: { id: string } }) {
  const id = generateId();
  const inbox_id = searchParams.id;
  const response = await fetch(`https://inhotel-bda7de42c465.herokuapp.com/assistant/get_ui_prompts?inbox_id=${inbox_id}`);
  const contentType = response.headers.get("content-type");
  let promptDataParsed={}
  console.log('inbox_id', searchParams.id);
  if (contentType && contentType.indexOf("application/json") !== -1) {
    promptDataParsed = await response.json();
  } else {
    // Handle other types of responses, if necessary
    const textResponse = await response.text();
    try {
      promptDataParsed = JSON.parse(textResponse);
    } catch (error) {
      console.error("Failed to parse response as JSON:", error);
      promptDataParsed = {}; // Ensure promptDataParsed is an object in case of parsing failure
    }
  }
  
  
  if (typeof promptDataParsed === 'string') {
    try {
      promptDataParsed = JSON.parse(promptDataParsed);
    } catch (error) {
      console.error("Failed to parse promptDataParsed as JSON:", error);
      promptDataParsed = {}; 
    }
  }
  
  return (
    <AI initialAIState={{ chatId: id, messages: [], inbox_id: inbox_id, promptData: promptDataParsed }}>
      <Chat id={id} />
    </AI>
  );
}
