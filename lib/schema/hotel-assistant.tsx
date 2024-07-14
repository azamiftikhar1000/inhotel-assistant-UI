import { DeepPartial } from 'ai'
import { z } from 'zod'

export const hotelAssistantSchema = z.object({
  query: z.string().describe('The query for hotel assistant Eg : "What is the price of room", "What is the location of hotel"')
})

export type PartialInquiry = DeepPartial<typeof hotelAssistantSchema>
