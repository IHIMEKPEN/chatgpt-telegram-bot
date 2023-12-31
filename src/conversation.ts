import {  ChatGPTConversation } from 'chatgpt';
const { Configuration, OpenAI, } = require("openai");
import { env } from './utils/env';

// store conversation
const memory = new Map<string, any>();

const api = new OpenAI({
  //@ts-ignore
  apiKey: env.CHATGPT_TOKEN,
});

const check = () => {
  return api.ensureAuth();
};

/**
 * send message to chatGPT
 */
export const send = async (
  id: number | string,
  context: string,
  onResponse?: (contents: string) => void,
) => {
  const sId = id.toString();
  let conversation = memory.get(sId);

  if (!conversation) {
    conversation = await create(sId);
  }

  return conversation.sendMessage(context, {
    timeoutMs: 2 * 60 * 1000,
    onConversationResponse(even: any) {
      onResponse?.(even.message?.content.parts[0] || '');
    },
  });
};

/**
 * create a new conversation
 */
export const create = async (id: number | string) => {
  const sId = id.toString();
  const conversation = api.getConversation();
  await check();
  memory.set(sId, conversation);
  return conversation;
};
