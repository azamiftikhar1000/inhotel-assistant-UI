import { createStreamableUI, createStreamableValue } from 'ai/rsc'
import { CoreMessage } from 'ai'
import { AnswerSection } from '@/components/answer-section'

export async function writer(
  uiStream: ReturnType<typeof createStreamableUI>,
  messages: CoreMessage[],
  hotel_id?: string,
  assistant_id?: string
) {
  let fullResponse = ''
  let hasError = false
  const streamableAnswer = createStreamableValue<string>('')
  const answerSection = <AnswerSection result={streamableAnswer.value} />
  uiStream.append(answerSection)

  const question = messages.map(message => message.content).join(' ');

  try {
    const response = await fetch('https://inhotel-workflow.replit.app/api/v1/prediction/abda5aa4-4c48-423a-afbe-a77c63bf0c43', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question,
        "overrideConfig": {
          "functionInputVariables": {
              "customFunction_0": {
            "data":question,
             "milvusFilter":`hotel_id == ${hotel_id} && assistant_id in [${assistant_id},0]`
            
            }}}}
    )
    });

    if (response.ok) {
      const result = await response.json();
      fullResponse = result.text;
      streamableAnswer.update(fullResponse);
    } else {
      throw new Error('Network response was not ok');
    }
  } catch (err) {
    hasError = true;
    if (err instanceof Error) {
      fullResponse = 'Error: ' + err.message;
    } else {
      fullResponse = 'An unknown error occurred';
    }
    streamableAnswer.update(fullResponse);
  } finally {
    streamableAnswer.done();
  }

  return { response: fullResponse, hasError }
}
