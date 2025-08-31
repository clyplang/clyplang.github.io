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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function highlightClyp(code: string): string {
  let highlighted = escapeHtml(code);
  
  // Replace comments first
  highlighted = highlighted.replace(/#.*$/gm, '<span class="comment">$&</span>');
  
  // String literals
  highlighted = highlighted.replace(/"([^"\\]|\\.)*"/g, '<span class="string">$&</span>');
  highlighted = highlighted.replace(/'([^'\\]|\\.)*'/g, '<span class="string">$&</span>');
  
  // Numbers
  highlighted = highlighted.replace(/\b\d+(\.\d+)?\b/g, '<span class="number">$&</span>');
  
  // Keywords
  KEYWORDS.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span class="keyword">${keyword}</span>`);
  });
  
  // Type keywords
  TYPE_KEYWORDS.forEach(type => {
    const regex = new RegExp(`\\b${type}\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span class="type">${type}</span>`);
  });
  
  // Built-in functions
  BUILTINS.forEach(builtin => {
    const regex = new RegExp(`\\b${builtin}\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span class="builtin">${builtin}</span>`);
  });
  
  return `<div class="highlight"><pre><code>${highlighted}</code></pre></div>`;
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