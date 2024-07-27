import { DeepPartial } from 'ai'
import { z } from 'zod'

export const nextActionSchema = z.object({
  next: z.enum(['inquire', 'proceed']), 
  thinking : z.string(),
})

export type NextAction = DeepPartial<typeof nextActionSchema>
