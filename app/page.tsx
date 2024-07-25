import { Chat } from '@/components/chat'
import { generateId } from 'ai'
import { AI } from './actions'

export const maxDuration = 60

export default async function Page({ searchParams }: { searchParams: { id: string } }) {
  const id = generateId();
  const inbox_id = searchParams.id;
  const response = await fetch(`https://inhotel-bda7de42c465.herokuapp.com/assistant/get_ui_prompts?inbox_id=${inbox_id}`);
  let promptData = await response.json();

  const promptDataParsed =JSON.parse( promptData);

  return (
    <AI initialAIState={{ chatId: id, messages: [], inbox_id: inbox_id, promptData: promptDataParsed }}>
      <Chat id={id} />
    </AI>
  );
}
