# Control Flow

Control flow statements allow you to execute code conditionally or repeatedly.

## Conditional Statements

`if`, `elif` (else if), and `else` are used to run code based on conditions.

```clyp
int x = 10;

if (x > 10) {
    print("x is greater than 10");
} elif (x == 10) {
    print("x is exactly 10");
} else {
    print("x is less than 10");
}
```

### Python Equivalent

```python
x = 10

if x > 10:
    print("x is greater than 10")
elif x == 10:
    print("x is exactly 10")
else:
    print("x is less than 10")
```

## Loops

Loops are used to execute a block of code multiple times.

### `while` Loop

A `while` loop continues as long as a condition is `true`.

```clyp
let count = 0;
while (count < 3) {
    print("Count is: " + toString(count));
    count = count + 1;
}
```

### `repeat` Loop

The `repeat` loop is a simple way to run a block of code a specific number of times.

```clyp
repeat [3] times {
    print("Hello from a repeat loop!");
}
```

### `for` Loop

Clyp also supports `for` loops for iterating over collections.

```clyp
list[str] names = ["Clyp", "Python", "Code"];
for name in names {
    print("Hello, " + name + "!");
}
```

### Python Equivalents

```python
# while loop
count = 0
while count < 3:
    print(f"Count is: {count}")
    count = count + 1

# for loop (equivalent to Clyp's repeat)
for _ in range(3):
    print("Hello from a for loop!")

# for loop over a list
names = ["Clyp", "Python", "Code"]
for name in names:
    print(f"Hello, {name}!")
```

## Loop Control

You can control loop execution with `break` and `continue`.

*   `break`: Exits the loop immediately.
*   `continue`: Skips the rest of the current iteration and proceeds to the next one.

```clyp
let i = 0;
while (i < 10) {
    i = i + 1;
    if (i == 3) {
        continue; // Skip printing 3
    }
    if (i == 5) {
        break; // Exit the loop
    }
    print(i); // Will print 1, 2, 4
}
```
