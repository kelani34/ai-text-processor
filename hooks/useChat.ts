import type { Message } from '@/components/ui/chat-message';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface UseChatOptions {
  initialMessages?: Message[];
  stream?: boolean;
}

export const useChat = ({ initialMessages = [] }: UseChatOptions) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [summaryInput, setSummaryInput] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const append = (message: Message) => {
    const newMessage: Message = {
      id: uuidv4(),
      role: message.role,
      content: message.content,
      createdAt: new Date(),
    };

    if (newMessage.role === 'user') {
      setInput(newMessage.content);
    }

    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };
  const stop = () => {
    setIsLoading(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event?: { preventDefault?: () => void }) => {
    if (event?.preventDefault) {
      event.preventDefault();
    }
    if (!input.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: input,
      createdAt: new Date(),
    };
    append(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const session = await window.ai.languageModel.create();

      const result = await session.prompt(userMessage.content);

      append({
        id: userMessage.id,
        role: 'assistant',
        content: result,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error fetching chat response:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSummary = async (summaryInput: Message) => {
    setInput('');
    setIsLoading(true);

    try {
      const summarizer = await window.ai.summarize.create({ type: 'tl;dr' });

      const result = await summarizer.summarize(summaryInput.content);

      console.log(result);

      //   append({
      //     id: summaryInput.id,
      //     role: 'assistant',
      //     content: result,
      //     createdAt: new Date(),
      //   });
    } catch (error) {
      console.error('Error fetching chat response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    handleSummary,
    append,
    stop,
    isLoading,
  };
};
