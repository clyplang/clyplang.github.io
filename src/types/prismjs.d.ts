declare module 'prismjs';

// Minimal augmentations to allow TypeScript imports in this project
declare namespace Prism {
  function highlight(code: string, grammar: any, language: string): string;
  const languages: any;
}

export as namespace Prism;
export = Prism;
