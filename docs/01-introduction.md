# Welcome to Clyp

Clyp is a modern, expressive programming language designed for simplicity and readability. It transpiles to Python, allowing you to leverage the vast Python ecosystem while writing in a clean, streamlined syntax.

## Philosophy

Clyp's design is guided by a few core principles:

*   **Readability:** Code is read more often than it is written. Clyp's syntax is designed to be intuitive and easy to understand, reducing cognitive load.
*   **Simplicity:** Clyp avoids boilerplate and complex syntax, allowing you to focus on your logic.
*   **Python Interoperability:** By transpiling to Python, Clyp gives you seamless access to Python's powerful libraries and frameworks.

## Your First Clyp Program

Here’s the traditional "Hello, World!" program in Clyp. It demonstrates variable declaration and the `print` function.

```clyp
# A simple "Hello, World!" program in Clyp
str name = "World";
print("Hello, " + name + "!");
```

This code declares a string variable `name`, assigns it the value "World", and then prints a greeting.

### Python Equivalent

For comparison, here is how you would write the same program in Python:

```python
# A simple "Hello, World!" program in Python
name: str = "World"
print("Hello, " + name + "!")
```

As you can see, Clyp is very similar to Python but aims for a slightly different developer experience with features like mandatory static typing for declarations and a different keyword set.
