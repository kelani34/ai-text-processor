import type { Message } from '@/components/ui/chat-message';
import { useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export interface UseChatOptions {
  initialMessages?: Message[];
  stream?: boolean;
}

export const useChat = ({ initialMessages = [] }: UseChatOptions) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const append = (message: Message) => {
    const newMessage: Message = {
      id: uuidv4(),
      role: message.role,
      content: message.content,
      createdAt: new Date(),
      type: message.type,
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
      type: 'prompt',
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
        type: 'prompt',
      });
    } catch (error) {
      console.error('Error fetching chat response:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSummary = async (summaryInput: Message) => {
    setIsLoading(true);

    try {
      const options = {
        sharedContext: 'This is a scientific article',
        type: 'key-points',
        format: 'markdown',
        length: 'medium',
      };

      const available = (await self.ai.summarizer.capabilities()).available;
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      let summarizer: any;
      if (available === 'no') {
        toast.error('Summarizer API is not available');
        return;
      }
      if (available === 'readily') {
        summarizer = await self.ai.summarizer.create(options);
        const result = await summarizer.summarize(summaryInput.content);
        append({
          id: uuidv4(),
          role: 'assistant',
          content: result,
          createdAt: new Date(),
          type: 'summary',
        });
      } else {
        summarizer = await self.ai.summarizer.create(options);

        summarizer.addEventListener(
          'downloadprogress',
          (e: { loaded: string; total: number }) => {
            toast.success(`${e.loaded}, ${e.total}`);
          }
        );
        await summarizer.ready;
      }
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
