"""
Custom Pygments lexer for the Clyp programming language.
Provides accurate syntax highlighting for Clyp code examples.
"""

from pygments.lexer import RegexLexer, words, bygroups
from pygments.token import (
    Keyword, Name, Number, String, Comment, Operator, Punctuation,
    Text
)

class ClypLexer(RegexLexer):
    """
    Custom lexer for the Clyp programming language.
    Supports Clyp-specific syntax highlighting.
    """
    
    name = 'Clyp'
    aliases = ['clyp']
    filenames = ['*.clyp']
    mimetypes = ['text/x-clyp']

    # Clyp keywords
    keywords = [
        'function', 'returns', 'class', 'if', 'else', 'elif', 'while', 'for',
        'repeat', 'times', 'return', 'let', 'self', 'null', 'true', 'false',
        'import', 'from', 'as', 'in', 'not', 'and', 'or', 'break', 'continue'
    ]

    # Clyp type keywords
    type_keywords = [
        'int', 'str', 'bool', 'float', 'list', 'dict', 'any', 'void'
    ]

    # Built-in functions
    builtins = [
        'print', 'len', 'range', 'toString', 'toInt', 'toFloat', 'toBool',
        'chunk', 'flatten', 'map', 'filter', 'reduce', 'sort', 'reverse',
        'read_file', 'write_file', 'slugify', 'uppercase', 'lowercase',
        'http_get', 'http_post', 'json_parse', 'json_stringify'
    ]

    tokens = {
        'root': [
            # Comments
            (r'#.*$', Comment.Single),
            (r'/\*.*?\*/', Comment.Multiline),
            
            # Strings
            (r'"([^"\\\\]|\\\\.)*"', String.Double),
            (r"'([^'\\\\]|\\\\.)*'", String.Single),
            
            # Numbers
            (r'\b\d+\.\d+\b', Number.Float),
            (r'\b\d+\b', Number.Integer),
            
            # Special rules for definitions and declarations
            (r'\b(function)(\s+)([a-zA-Z_][a-zA-Z0-9_]*)',
             bygroups(Keyword, Text, Name.Function)),
            (r'\b(class)(\s+)([a-zA-Z_][a-zA-Z0-9_]*)',
             bygroups(Keyword, Text, Name.Class)),
            (r'\b([a-zA-Z_][a-zA-Z0-9_]*(?:\[.*?\])?)(\s+)([a-zA-Z_][a-zA-Z0-9_]*)(\s*)(=)',
             bygroups(Keyword.Type, Text, Name.Variable, Text, Operator.Assignment)),
            (r'\b([a-zA-Z_][a-zA-Z0-9_]*)(\s*)(\()',
             bygroups(Name.Function, Text, Punctuation)),

            # Keywords
            (words(keywords, suffix=r'\b'), Keyword),
            (words(type_keywords, suffix=r'\b'), Keyword.Type),
            (words(builtins, suffix=r'\b'), Name.Builtin),
            
            # Operators
            (r'\|>', Operator.Special),
            (r'(==|!=|<=|>=|&&|\|\|)', Operator),
            (r'[+\-*/%]=', Operator.Assignment),
            (r'[+\-*/%=<>!&|^~]', Operator),
            
            # Punctuation
            (r'[{}()\[\];,.]', Punctuation),
            
            # Identifiers
            (r'\b[a-zA-Z_][a-zA-Z0-9_]*\b', Name),
            
            # Whitespace
            (r'\s+', Text),
            
            # Everything else
            (r'.', Text),
        ]
    }
