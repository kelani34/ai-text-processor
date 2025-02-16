import { v4 as uuidv4 } from 'uuid';
import type { Message } from './chat-message';

interface PromptSuggestionsProps {
  label: string;
  append: (message: Message) => void;
  suggestions: string[];
}

export function PromptSuggestions({
  label,
  append,
  suggestions,
}: PromptSuggestionsProps) {
  return (
    <div className='space-y-6'>
      <h2 className='text-center text-2xl font-bold'>{label}</h2>
      <div className='flex gap-6 text-sm'>
        {suggestions.map((suggestion) => (
          <button
            type='button'
            key={suggestion}
            onClick={() =>
              append({
                id: uuidv4(),
                role: 'user',
                content: suggestion,
                createdAt: new Date(),
              })
            }
            className='h-max flex-1 rounded-xl border bg-background p-4 hover:bg-muted'
          >
            <p>{suggestion}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
