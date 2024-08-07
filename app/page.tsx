import { Chat } from '@/components/chat'
import { generateId } from 'ai'
import { AI } from './actions'

export const maxDuration = 60

export default async function Page({ searchParams }: { searchParams: { id: string } }) {
  const id = generateId();
  const inbox_id = searchParams.id;
  
  // Call the pcps_account API
  const response = await fetch(`https://inhotel-bda7de42c465.herokuapp.com/public/pcps_account?inbox_id=${inbox_id}`, {
    method: 'POST'
  });

  const contentType = response.headers.get("content-type");
  let pcpsDataParsed: { assistant_id?: any, hotel_id?: any } = {};

  console.log('inbox_id', searchParams.id);

  if (contentType && contentType.indexOf("application/json") !== -1) {
    pcpsDataParsed = await response.json();
  } else {
    // Handle other types of responses, if necessary
    const textResponse = await response.text();
    try {
      pcpsDataParsed = JSON.parse(textResponse);
    } catch (error) {
      console.error("Failed to parse response as JSON:", error);
      pcpsDataParsed = {}; 
    }
  }
  
  if (typeof pcpsDataParsed === 'string') {
    try {
      pcpsDataParsed = JSON.parse(pcpsDataParsed);
    } catch (error) {
      console.error("Failed to parse pcpsDataParsed as JSON:", error);
      pcpsDataParsed = {}; 
    }
  }
  
  return (
    <AI initialAIState={{ chatId: id, messages: [],  assistant_id: pcpsDataParsed?.assistant_id, hotel_id: pcpsDataParsed?.hotel_id}}>
      <Chat id={id} />
    </AI>
  );
}
