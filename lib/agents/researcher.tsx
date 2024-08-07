import { createStreamableUI, createStreamableValue } from 'ai/rsc';
import { CoreMessage, ToolCallPart, ToolResultPart, streamText } from 'ai';
import { getTools } from './tools';
import { getModel, transformToolMessages } from '../utils';
import { AnswerSection } from '@/components/answer-section';

export async function researcher(
  uiStream: ReturnType<typeof createStreamableUI>,
  streamableText: ReturnType<typeof createStreamableValue<string>>,
  messages: CoreMessage[],
  inbox_id?: string, // Add inbox_id parameter
  systemPrompt?: string,
  hotelAssistantPrompt?: any
) {
  let fullResponse = '';
  let hasError = false;
  let finishReason = '';

  // Transform the messages if using Ollama provider
  let processedMessages = messages;
  const useOllamaProvider = !!(
    process.env.OLLAMA_MODEL && process.env.OLLAMA_BASE_URL
  );
  if (useOllamaProvider) {
    processedMessages = transformToolMessages(messages);
  }
  const includeToolResponses = messages.some(message => message.role === 'tool');
  const useSubModel = useOllamaProvider && includeToolResponses;

  const streambleAnswer = createStreamableValue<string>('');
  const answerSection = <AnswerSection result={streambleAnswer.value} />;

  const currentDate = new Date().toLocaleString();
  const result = await streamText({
    model: getModel(useSubModel),
    maxTokens: 2500,
    system: `${systemPrompt} Current date and time: ${currentDate}`,
    messages: processedMessages,
    tools: getTools({
      uiStream,
      fullResponse,
      inbox_id,
      hotelAssistantPrompt
      
    }),
    onFinish: async event => {
      finishReason = event.finishReason;
      fullResponse = event.text;
      streambleAnswer.done();
    }
  }).catch(err => {
    hasError = true;
    fullResponse = 'Error: ' + err.message;
    streamableText.update(fullResponse);
  });

  // If the result is not available, return an error response
  if (!result) {
    return { result, fullResponse, hasError, toolResponses: [] };
  }

  const hasToolResult = messages.some(message => message.role === 'tool');
  if (hasToolResult) {
    uiStream.append(answerSection);
  }

  // Process the response
  const toolCalls: ToolCallPart[] = [];
  const toolResponses: ToolResultPart[] = [];
  for await (const delta of result.fullStream) {
    switch (delta.type) {
      case 'text-delta':
        if (delta.textDelta) {
          fullResponse += delta.textDelta;
          if (hasToolResult) {
            streambleAnswer.update(fullResponse);
          } else {
            streamableText.update(fullResponse);
          }
        }
        break;
      case 'tool-call':
        toolCalls.push(delta);
        break;
      case 'tool-result':
        if (!delta.result) {
          hasError = true;
        }
        toolResponses.push(delta);
        break;
      case 'error':
        console.log('Error: ' + delta.error);
        hasError = true;
        fullResponse += `\nError occurred while executing the tool`;
        break;
    }
  }
  messages.push({
    role: 'assistant',
    content: [{ type: 'text', text: fullResponse }, ...toolCalls]
  });

  if (toolResponses.length > 0) {
    // Add tool responses to the messages
    messages.push({ role: 'tool', content: toolResponses });
  }

  return { result, fullResponse, hasError, toolResponses, finishReason };
}
