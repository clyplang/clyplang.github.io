# Functions

Functions are reusable blocks of code that perform a specific task.

## Defining Functions

You define a function using the `def` keyword. You must specify the type of each parameter and the type of the value the function returns.

```clyp
# A function that takes two integers and returns their sum
def add(int a, int b) returns int {
    return a + b;
}

# A function that takes a string and returns nothing (void)
def greet(str name) returns void {
    print("Hello, " + name);
}
```

If a function does not return a value, use `null` as the return type.

### Python Equivalent

```python
# Python uses the 'def' keyword and type hints
def add(a: int, b: int) -> int:
    return a + b

def greet(name: str) -> None:
    print(f"Hello, {name}")
```

## Parameters and Default Values

You can provide default values for parameters, making them optional when the function is called.

```clyp
def power(int base, int exp = 2) returns int {
    # In a real scenario, you'd implement the power logic
    # For now, this is a placeholder
    return base * base; # Simplified for exp=2
}
```

## Calling Functions

To use a function, you "call" it by its name and provide arguments.

```clyp
let sum = add(5, 3);
print("Sum is: " + toString(sum)); // Prints: Sum is: 8

greet("Developer"); // Prints: Hello, Developer

let squared = power(10); // Uses default exp=2
print("10 squared is: " + toString(squared)); // Prints: 10 squared is: 100

let cubed = power(3, 3); // This would need a full implementation
```
