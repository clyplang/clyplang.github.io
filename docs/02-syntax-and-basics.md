# Syntax and Basics

This section covers the fundamental building blocks of the Clyp language.

## Comments

Comments are used to leave notes in your code. They are ignored by the transpiler.

```clyp
# This is a single-line comment.
```

## Variables

Variables are used to store data. In Clyp, variables can be declared with explicit types or using the `let` keyword for type inference (similar to Python's dynamic typing).

### Typed Declarations

You must declare the type of a variable when you create it. This helps prevent bugs by catching type errors early.

```clyp
str name = "Clyp";
int version = 1;
bool is_awesome = true;
list[int] numbers = [1, 2, 3];
```

### Type-Inferred Declarations with `let`

If you prefer, you can use the `let` keyword, and the transpiler will infer the type from the assigned value.

```clyp
let name = "Clyp"; // Inferred as str
let version = 1;   // Inferred as int
```

### Python Equivalents

```python
# Python uses type hints, which are optional but recommended
name: str = "Clyp"
version: int = 1

# Standard Python variable assignment
is_awesome = True
numbers = [1, 2, 3]
```

## Data Types

Clyp supports several primitive and complex data types.

*   `int`: Integers (e.g., `10`, `-5`).
*   `float`: Floating-point numbers (e.g., `3.14`).
*   `str`: Strings of text (e.g., `"Hello"`).
*   `bool`: Boolean values (`true` or `false`).
*   `list`: Ordered collections of items (e.g., `[1, "apple", true]`).
*   `dict`: Collections of key-value pairs (e.g., `{"name": "Clyp", "version": 1}`).
*   `null`: Represents the absence of a value.

```clyp
# Examples of data types
int my_int = 42;
float my_float = 3.14;
str my_str = "Hello, Clyp!";
bool my_bool = true;
list[str] my_list = ["a", "b", "c"];
dict[str, int] my_dict = {"one": 1, "two": 2};
any my_var = null;
```

## Operators

Clyp supports standard operators for arithmetic, comparison, and logic.

| Operator | Description         | Example              |
| :------- | :------------------ | :------------------- |
| `+`      | Addition            | `5 + 2`              |
| `-`      | Subtraction         | `5 - 2`              |
| `*`      | Multiplication      | `5 * 2`              |
| `/`      | Division            | `5 / 2`              |
| `%`      | Modulo              | `5 % 2`              |
| `==`     | Equal to            | `x == y`             |
| `!=`     | Not equal to        | `x != y`             |
| `<`      | Less than           | `x < y`              |
| `>`      | Greater than        | `x > y`              |
| `<=`     | Less than or equal  | `x <= y`             |
| `>=`     | Greater than or equal| `x >= y`             |
| `and`    | Logical AND         | `x and y`            |
| `or`     | Logical OR          | `x or y`             |
| `not`    | Logical NOT         | `not x`              |
