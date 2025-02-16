'use client';

import { forwardRef, useCallback } from 'react';
import { ArrowDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAutoScroll } from '@/hooks/use-auto-scroll';
import { Button } from '@/components/ui/button';
import type { Message } from '@/components/ui/chat-message';
import { CopyButton } from '@/components/ui/copy-button';
import { SummaryButton } from '@/components/ui/summary-button';
import { MessageInput } from '@/components/ui/message-input';
import { MessageList } from '@/components/ui/message-list';
import { PromptSuggestions } from '@/components/ui/prompt-suggestions';

interface ChatPropsBase {
  handleSubmit: (event?: { preventDefault?: () => void }) => void;
  handleSummary: (summaryInput: Message) => void;
  messages: Array<Message>;
  input: string;
  className?: string;
  handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  isGenerating: boolean;
  stop?: () => void;
  onRateResponse?: (
    messageId: string,
    rating: 'thumbs-up' | 'thumbs-down'
  ) => void;
}

interface ChatPropsWithoutSuggestions extends ChatPropsBase {
  append?: never;
  suggestions?: never;
}

interface ChatPropsWithSuggestions extends ChatPropsBase {
  append: (message: Message) => void;
  suggestions: string[];
}

type ChatProps = ChatPropsWithoutSuggestions | ChatPropsWithSuggestions;

export function Chat({
  messages,
  handleSubmit,
  handleSummary,
  input,
  handleInputChange,
  stop,
  isGenerating,
  append,
  suggestions,
  className,
}: ChatProps) {
  const lastMessage = messages.at(-1);
  const isEmpty = messages.length === 0;
  const isTyping = lastMessage?.role === 'user';

  const messageOptions = useCallback(
    (message: Message) => ({
      actions: (
        <div className='flex gap-2'>
          <CopyButton
            content={message.content}
            copyMessage='Copied response to clipboard!'
          />
          <SummaryButton input={message} handleSummary={handleSummary} />
        </div>
      ),
    }),
    [handleSummary]
  );

  return (
    <ChatContainer className={className}>
      {isEmpty && append && suggestions ? (
        <PromptSuggestions
          label='Try these prompts ✨'
          append={append}
          suggestions={suggestions}
        />
      ) : null}

      {messages.length > 0 ? (
        <ChatMessages messages={messages}>
          <MessageList
            messages={messages}
            isTyping={isTyping}
            messageOptions={messageOptions}
          />
        </ChatMessages>
      ) : null}

      <ChatForm
        className='mt-auto'
        isPending={isGenerating || isTyping}
        handleSubmit={handleSubmit}
      >
        <MessageInput
          value={input}
          onChange={handleInputChange}
          stop={stop}
          isGenerating={isGenerating}
        />
      </ChatForm>
    </ChatContainer>
  );
}
Chat.displayName = 'Chat';

export function ChatMessages({
  messages,
  children,
}: React.PropsWithChildren<{
  messages: Message[];
}>) {
  const {
    containerRef,
    scrollToBottom,
    handleScroll,
    shouldAutoScroll,
    handleTouchStart,
  } = useAutoScroll([messages]);

  return (
    <div
      className='grid grid-cols-1 overflow-y-auto pb-4'
      ref={containerRef}
      onScroll={handleScroll}
      onTouchStart={handleTouchStart}
    >
      <div className='max-w-full [grid-column:1/1] [grid-row:1/1]'>
        {children}
      </div>

      <div className='flex flex-1 items-end justify-end [grid-column:1/1] [grid-row:1/1]'>
        {!shouldAutoScroll && (
          <div className='sticky bottom-0 left-0 flex w-full justify-end'>
            <Button
              onClick={scrollToBottom}
              className='h-8 w-8 rounded-full ease-in-out animate-in fade-in-0 slide-in-from-bottom-1'
              size='icon'
              variant='ghost'
            >
              <ArrowDown className='h-4 w-4' />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export const ChatContainer = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('grid max-h-full w-full grid-rows-[1fr_auto]', className)}
      {...props}
    />
  );
});
ChatContainer.displayName = 'ChatContainer';

interface ChatFormProps {
  className?: string;
  isPending: boolean;
  handleSubmit: (event?: { preventDefault?: () => void }) => void;
  children: React.ReactNode;
}

export const ChatForm = forwardRef<HTMLFormElement, ChatFormProps>(
  (
    {
      children,
      handleSubmit,

      className,
    },
    ref
  ) => {
    const onSubmit = (event: React.FormEvent) => {
      handleSubmit(event);
    };

    return (
      <form ref={ref} onSubmit={onSubmit} className={className}>
        {children}
      </form>
    );
  }
);
ChatForm.displayName = 'ChatForm';
