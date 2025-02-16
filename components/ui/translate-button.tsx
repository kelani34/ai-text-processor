'use client';

import { CircleDotDashed, Pen } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Message } from './chat-message';

type CopyButtonProps = {
  input: Message;
  handleSummary: (summaryInput: Message) => void;
  isSummarizing: boolean;
};

export function SummaryButton({
  input,
  handleSummary,
  isSummarizing,
}: CopyButtonProps) {
  return (
    <Button
      variant='ghost'
      type='button'
      size='icon'
      className='relative h-6 w-6'
      aria-label='Copy to clipboard'
      onClick={() => handleSummary(input)}
      disabled={isSummarizing}
    >
      <div className='absolute inset-0 flex items-center justify-center'>
        <CircleDotDashed
          className={cn(
            'h-4 w-4 transition-transform ease-in-out',
            isSummarizing ? 'scale-100 animate-spin' : 'scale-0'
          )}
        />
      </div>
      <Pen
        className={cn(
          'h-4 w-4 transition-transform ease-in-out',
          isSummarizing ? 'scale-0' : 'scale-100'
        )}
      />
    </Button>
  );
}
