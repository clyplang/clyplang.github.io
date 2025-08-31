declare module 'prismjs';

declare namespace Prism {
  function highlight(code: string, grammar: any, language: string): string;
  const languages: any;
}

export as namespace Prism;
export = Prism;
