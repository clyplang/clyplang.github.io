// Custom Clyp syntax highlighter
export interface HighlightedCode {
  highlighted_code: string;
}

export interface CodeExample {
  title: string;
  description: string;
  code: string;
  highlighted_code?: string;
}

// Clyp language tokens
const KEYWORDS = [
  'function', 'returns', 'class', 'if', 'else', 'elif', 'while', 'for',
  'repeat', 'times', 'return', 'let', 'self', 'null', 'true', 'false',
  'import', 'from', 'as', 'in', 'not', 'and', 'or', 'break', 'continue'
];

const TYPE_KEYWORDS = [
  'int', 'str', 'bool', 'float', 'list', 'dict', 'any', 'void'
];

const BUILTINS = [
  'print', 'len', 'range', 'toString', 'toInt', 'toFloat', 'toBool',
  'chunk', 'flatten', 'map', 'filter', 'reduce', 'sort', 'reverse',
  'read_file', 'write_file', 'slugify', 'uppercase', 'lowercase',
  'http_get', 'http_post', 'json_parse', 'json_stringify'
];

// @ts-ignore: prismjs doesn't have bundled types in this project
import Prism from 'prismjs';
// load basic components if available; Prism core is sufficient for a custom definition

// Define the Clyp language for Prism
Prism.languages.clyp = {
  'comment': /#.*/,
  'string': {
    pattern: /(?:(?:"(?:\\.|[^"\\])*")|(?:'(?:\\.|[^'\\])*'))/,
    greedy: true
  },
  'class-name': {
    pattern: /(?<=\bclass\s+)[A-Za-z_][A-Za-z0-9_]*/,
    alias: 'nc'
  },
  'function': {
    pattern: /[A-Za-z_][A-Za-z0-9_]*(?=\s*\()/,
    alias: 'nf'
  },
  'keyword': new RegExp('\\b(?:' + KEYWORDS.join('|') + ')\\b'),
  'type': new RegExp('\\b(?:' + TYPE_KEYWORDS.join('|') + ')\\b'),
  'builtin': new RegExp('\\b(?:' + BUILTINS.join('|') + ')\\b'),
  'number': /\b\d+(?:\.\d+)?\b/,
  'operator': /\|>|=>|\+\+|--|==|!=|<=|>=|\+|-|\*|\/|%|=|<|>|\|\||&&|!|\|>/,
  'punctuation': /[{}[\];(),.:]/
};

// Map Prism token class names to the short classes used in our CSS
const classMap: Record<string, string> = {
  'keyword': 'k',
  'type': 'kt',
  'function': 'nf',
  'class-name': 'nc',
  'string': 's',
  'number': 'm',
  'builtin': 'nb',
  'operator': 'op',
  'comment': 'c',
  'punctuation': 'p'
};

export function highlightClyp(code: string): string {
  // Use Prism to highlight
  const raw = Prism.highlight(code, Prism.languages.clyp, 'clyp');

  // Post-process Prism's HTML (.token.NAME) to match our CSS short classes
  const fixed = raw.replace(/class="([^"]*)"/g, (m: string, cls: string) => {
    // Only modify spans that include 'token'
    if (!/\btoken\b/.test(cls)) return `class="${cls}"`;
  const parts = cls.split(/\s+/).filter(Boolean);
  // find the first token type (not 'token')
  const tokenType = parts.find((p: string) => p !== 'token' && p !== 'important');
    if (tokenType && classMap[tokenType]) {
      return `class="${classMap[tokenType]}"`;
    }
    // fallback: keep original
    return `class="${cls}"`;
  });

  return `<div class="highlight"><pre><code class="language-clyp">${fixed}</code></pre></div>`;
}

// Code examples from the original Python file
export const EXAMPLES: Record<string, CodeExample> = {
  hello_world: {
    title: 'Hello World',
    description: 'A simple greeting program showing variable declaration and function definition.',
    code: `# A simple "Hello, World!" program in Clyp
str name = "World";
print("Hello, " + name + "!");

# Define a function to greet someone
greet(str person) returns str {
    return "Greetings, " + person + "!";
};

# Call the function and print the result
print(greet("Clyp Developer"));`
  },
  data_structures: {
    title: 'Data Structures',
    description: 'Working with lists, chunking, and flattening operations.',
    code: `# Working with data structures in Clyp
list[int] numbers = [1, 2, 3, 4, 5, 6];
print("Original list:");
print(numbers);

# Get chunks of the list
list[list[int]] chunks = chunk(numbers, 2);
print("List chunked into size 2:");
print(chunks);

# Flatten the list back
list[int] flattened = flatten(chunks);
print("Flattened list:");
print(flattened);

# Repeat loop for iteration
repeat 3 {
    print("Hello from a repeat loop!");
};`
  },
  advanced: {
    title: 'Advanced Features',
    description: 'Classes, conditionals, and the powerful pipeline operator.',
    code: `# Advanced Clyp features
class Counter {
    int count = 0;
    
    increment(self) returns null {
        self.count = self.count + 1;
    };

    get_count(self) returns int {
        return self.count;
    };
};

let c = Counter();
c.increment();
c.increment();
print("Count is: " + toString(c.get_count()));`
  }
};

// Add highlighting to examples
Object.keys(EXAMPLES).forEach(key => {
  EXAMPLES[key].highlighted_code = highlightClyp(EXAMPLES[key].code);
});