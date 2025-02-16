'use client';


import { Chat } from '@/components/ui/chat';
import { useChat } from '@/hooks/useChat';

export default function HomePage() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    handleSummary,
    append,
    stop,
    isLoading,
  } = useChat({ initialMessages: [], stream: true });

  return (
    <div className='flex items-center justify-center py-6 h-full container  w-full'>
      <Chat
        className='grow h-full'
        messages={messages}
        handleSubmit={handleSubmit}
        handleSummary={handleSummary}
        input={input}
        handleInputChange={handleInputChange}
        isGenerating={isLoading}
        stop={stop}
        append={append}
        suggestions={[
          'Generate a tasty vegan lasagna recipe for 3 people.',
          'Generate a list of 5 questions for a job interview for a software engineer.',
          'Who won the 2022 FIFA World Cup?',
        ]}
      />
    </div>
  );
}
