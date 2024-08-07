// import { Copilot } from '@/components/copilot'
// import { createStreamableUI, createStreamableValue } from 'ai/rsc'
// import { CoreMessage, streamObject } from 'ai'
// import { PartialInquiry, inquirySchema } from '@/lib/schema/inquiry'
// import { getModel } from '../utils'

// export async function inquire(
//   uiStream: ReturnType<typeof createStreamableUI>,
//   messages: CoreMessage[],
//   systemPrompt?: string
  
// ) {
//   const objectStream = createStreamableValue<PartialInquiry>()
//   uiStream.update(<Copilot inquiry={objectStream.value} />)

//   let finalInquiry: PartialInquiry = {}
//   await streamObject({
//     model: getModel(),
//     system: `${systemPrompt}
//     `,
//     messages,
//     schema: inquirySchema
//   })
//     .then(async result => {
//       for await (const obj of result.partialObjectStream) {
//         if (obj) {
//           objectStream.update(obj)
//           finalInquiry = obj
//         }
//       }
//     })
//     .finally(() => {
//       objectStream.done()
//     })

//   return finalInquiry
// }

import { Copilot } from '@/components/copilot'
import { createStreamableUI, createStreamableValue } from 'ai/rsc'
import { CoreMessage } from 'ai'
import { PartialInquiry, inquirySchema } from '@/lib/schema/inquiry'
import { getModel } from '../utils'

export async function inquire(
  uiStream: ReturnType<typeof createStreamableUI>,
  messages: CoreMessage[],
  hotel_id?: string,
  assistant_id?: string
) {
  const objectStream = createStreamableValue<PartialInquiry>()
  uiStream.update(<Copilot inquiry={objectStream.value} />)

  const question = messages.map(message => message.content).join(' ');

  const response = await fetch('https://inhotel-workflow.replit.app/api/v1/prediction/05dd264c-4cd2-46fb-a7d3-20d02199dbe2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ question })
  });

  let finalInquiry: PartialInquiry = {};
  if (response.ok) {
    const result = await response.json();
    if (result.json) {
      objectStream.update(result.json);
      finalInquiry = result.json;
    }
  }

  objectStream.done();

  return finalInquiry;
}
