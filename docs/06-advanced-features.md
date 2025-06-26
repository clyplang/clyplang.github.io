# Advanced Features

Clyp includes powerful features for writing clean and modular code.

## The Pipeline Operator `|>`

The pipeline operator `|>` allows you to chain function calls together in a readable, linear sequence. It takes the result of the expression on its left and passes it as the first argument to the function on its right.

```clyp
def double(int n) returns int {
    return n * 2;
}

def add_five(int n) returns int {
    return n + 5;
}

let initial_value = 10;

# Without pipeline
let result1 = add_five(double(initial_value)); # Harder to read
print(toString(result1)); # Prints: 25

# With pipeline
let result2 = initial_value |> double |> add_five; # Clean and sequential
print(toString(result2)); # Prints: 25
```

This is especially useful for data transformation workflows.

### Python Equivalent

Python does not have a built-in pipeline operator, so you would use nested function calls or sequential assignments.

```python
def double(n: int) -> int:
    return n * 2

def add_five(n: int) -> int:
    return n + 5

initial_value = 10

# Nested calls
result1 = add_five(double(initial_value))

# Sequential assignments
result2_step1 = double(initial_value)
result2 = add_five(result2_step1)
```

## Modules and Imports

Clyp allows you to organize your code into multiple files (modules) and import them where needed.

Assume you have a file named `math_utils.clyp`:
```clyp
# filepath: math_utils.clyp
def add(int a, int b) returns int {
    return a + b;
}
```

You can import and use this module in another file, like `main.clyp`:

### `clyp import`

This imports the entire module.

```clyp
# filepath: main.clyp
clyp import math_utils;

let result = math_utils.add(5, 3);
print(toString(result)); # Prints: 8
```

### `clyp from ... import`

This imports specific functions or classes from a module.

```clyp
# filepath: main.clyp
clyp from math_utils import add;

let result = add(5, 3);
print(toString(result)); # Prints: 8
```

### Python Equivalent

```python
# import math_utils
import math_utils

result = math_utils.add(5, 3)
print(result)

# from math_utils import add
from math_utils import add

result = add(5, 3)
print(result)
```
