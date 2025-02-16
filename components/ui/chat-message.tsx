'use client';

import type React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';

const chatBubbleVariants = cva(
  'group/message relative break-words rounded-lg p-3 text-sm sm:max-w-[70%]',
  {
    variants: {
      isUser: {
        true: 'bg-primary text-primary-foreground',
        false: 'bg-muted text-foreground',
      },
      animation: {
        none: '',
        slide: 'duration-300 animate-in fade-in-0',
        scale: 'duration-300 animate-in fade-in-0 zoom-in-75',
        fade: 'duration-500 animate-in fade-in-0',
      },
    },
    compoundVariants: [
      {
        isUser: true,
        animation: 'slide',
        class: 'slide-in-from-right',
      },
      {
        isUser: false,
        animation: 'slide',
        class: 'slide-in-from-left',
      },
      {
        isUser: true,
        animation: 'scale',
        class: 'origin-bottom-right',
      },
      {
        isUser: false,
        animation: 'scale',
        class: 'origin-bottom-left',
      },
    ],
  }
);

type Animation = VariantProps<typeof chatBubbleVariants>['animation'];

export interface Message {
  id: string;
  role: 'user' | 'assistant' | (string & {});
  content: string;
  createdAt?: Date;
  type: 'summary' | 'translate' | 'prompt';
}

export interface ChatMessageProps extends Message {
  showTimeStamp?: boolean;
  animation?: Animation;
  actions?: React.ReactNode;
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  createdAt,
  type = 'prompt',
  showTimeStamp = false,
  animation = 'scale',
  actions,
  className,
}) => {
  const isUser = role === 'user';

  const formattedTime = createdAt?.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={cn('flex flex-col', isUser ? 'items-end' : 'items-start')}>
      {type === 'prompt' && (
        <div
          className={cn(chatBubbleVariants({ isUser, animation }), className)}
        >
          <div>
            <MarkdownRenderer>{content}</MarkdownRenderer>{' '}
          </div>
          {role === 'assistant' && actions ? (
            <div className='absolute -bottom-4 right-2 flex space-x-1 rounded-lg border bg-background p-1 text-foreground opacity-0 transition-opacity group-hover/message:opacity-100'>
              {actions}
            </div>
          ) : null}
        </div>
      )}
      {type === 'summary' && (
        <div
          className={cn(
            chatBubbleVariants({ isUser, animation }),
            className,
            'bg-slate-300 ml-4'
          )}
        >
          <p className='opacity-40 font-bold'>Summary</p>
          <MarkdownRenderer>{content}</MarkdownRenderer>
          {role === 'assistant' && actions ? (
            <div className='absolute -bottom-4 right-2 flex space-x-1 rounded-lg border bg-background p-1 text-foreground opacity-0 transition-opacity group-hover/message:opacity-100'>
              {actions}
            </div>
          ) : null}
        </div>
      )}
      {type === 'translate' && (
        <div>
          <MarkdownRenderer>{content}</MarkdownRenderer>{' '}
        </div>
      )}

      {showTimeStamp && createdAt ? (
        <time
          dateTime={createdAt.toISOString()}
          className={cn(
            'mt-1 block px-1 text-xs opacity-50',
            animation !== 'none' && 'duration-500 animate-in fade-in-0',
            type === 'summary' && 'ml-4'
          )}
        >
          {formattedTime}
        </time>
      ) : null}
    </div>
  );
};
