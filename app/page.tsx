'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    (async () => {
      const session = await window.ai.languageModel.create();

      // Prompt the model and wait for the whole result to come back.
      const result = await session.prompt('Write me a poem.');
      console.log(result);

      // Prompt the model and stream the result:
      const stream = await session.promptStreaming(
        'Write me an extra-long poem.'
      );
      for await (const chunk of stream) {
        console.log(chunk);
      }
    })();
  }, []);

  return <main></main>;
}
