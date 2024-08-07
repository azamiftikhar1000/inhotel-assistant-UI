import { createStreamableUI, createStreamableValue } from 'ai/rsc'
import { CoreMessage } from 'ai'
import { PartialRelated } from '@/lib/schema/related'
import SearchRelated from '@/components/search-related'

// Define the type for the API response item
interface ApiResponseItem {
  query: string;
}

// Define the type for the entire API response
interface ApiResponse {
  json: ApiResponseItem[];
  question: string;
  chatId: string;
  chatMessageId: string;
  sessionId: string;
}

export async function querySuggestor(
  uiStream: ReturnType<typeof createStreamableUI>,
  messages: CoreMessage[],
) {
  const objectStream = createStreamableValue<PartialRelated>()
  uiStream.append(<SearchRelated relatedQueries={objectStream.value} />)

  const lastMessages = messages.slice(-1).map(message => {
    return {
      ...message,
      role: 'user'
    }
  }) as CoreMessage[]

  const requestData = {
    question: lastMessages.map(message => message.content).join(' ')
  }

  let finalRelatedQueries: PartialRelated = {}
  try {
    const response = await fetch('https://inhotel-workflow.replit.app/api/v1/prediction/76868c30-f054-4191-be7f-0ac6500cfbaa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })

    const data: ApiResponse = await response.json()
    if (data.json) {
      const relatedQueries = data.json.map((item: ApiResponseItem) => ({ query: item.query }))
      objectStream.update({ items: relatedQueries })
      finalRelatedQueries = { items: relatedQueries }
    }
  } catch (error) {
    console.error('Error fetching related queries:', error)
  } finally {
    objectStream.done()
  }

  return finalRelatedQueries
}
