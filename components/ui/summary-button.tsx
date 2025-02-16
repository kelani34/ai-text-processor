'use client';

import { Check, Pen } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Message } from './chat-message';

type CopyButtonProps = {
  input: Message;
  handleSummary: (summaryInput: Message) => void;
};

export function SummaryButton({ input, handleSummary }: CopyButtonProps) {
  return (
    <Button
      variant='ghost'
      size='icon'
      className='relative h-6 w-6'
      aria-label='Copy to clipboard'
      onClick={() => handleSummary(input)}
    >
      <div className='absolute inset-0 flex items-center justify-center'>
        <Check
          className={cn(
            'h-4 w-4 transition-transform ease-in-out'
            // isCopied ? 'scale-100' : 'scale-0'
          )}
        />
      </div>
      <Pen
        className={cn(
          'h-4 w-4 transition-transform ease-in-out'
          // isCopied ? 'scale-0' : 'scale-100'
        )}
      />
    </Button>
  );
}
