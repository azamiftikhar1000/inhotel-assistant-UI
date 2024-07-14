import { tool } from 'ai'
import { createStreamableValue } from 'ai/rsc'
import { hotelAssistantSchema } from '@/lib/schema/hotel-assistant'
import { ToolProps } from '.'


// Start Generation Here
export const hotelAssistant = ({ uiStream, fullResponse }: ToolProps) => tool({
  description: 'Hotel Assistant which have all the information of hotel get anything you want to know about hotel',
  parameters: hotelAssistantSchema,
  execute: async ({ query }) => {
    let hasError = false
    const streamResults = createStreamableValue<string>()
    let Result
    try {
      console.log('query', query)
      const response = await fetch(`https://inhotel-bda7de42c465.herokuapp.com/chat/get_response?inbox_id=bd0c3189-6499-4f99-880a-6983f6f9de58&user_input=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      Result = await response.json()
    } catch (error) {
      console.error('Hotel assiatant error:', error)
      hasError = true
    }

    if (hasError) {
      fullResponse = `An error occurred while searching for videos with "${query}.`
      uiStream.update(null)
      streamResults.done()
      return Result
    }

    streamResults.done(JSON.stringify(Result))

    return Result
  }
})
