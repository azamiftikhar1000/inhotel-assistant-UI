import { Chat } from '@/components/chat'
import { generateId } from 'ai'
import { AI } from './actions'

export const maxDuration = 60

export default function Page({
  searchParams
}: {
  searchParams: { id: string }
}){
  const id = generateId()
  const inbox_id = searchParams.id
  console.log('searchParams.id', searchParams.id)
  return (
    <AI initialAIState={{ chatId: id, messages: [],inbox_id:inbox_id }}>
      <Chat id={id} />
    </AI>
  )
}



