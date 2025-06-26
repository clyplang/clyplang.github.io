# Classes

Classes are blueprints for creating objects. They bundle data (attributes) and functions that operate on the data (methods).

## Defining a Class

Use the `class` keyword to define a class.

```clyp
class Counter {
    def __init_(self) {
        # Constructor to initialize attributes
        self.count: int = 0;  # Initialize count to zero
    }

    # Method to increment the count
    def increment(self) returns void {
        self.count = self.count + 1;
    }

    # Method to get the current count
    def get_count(self) returns int {
        return self.count;
    }
}
```
### The `self` Keyword

The `self` keyword refers to the instance of the class itself. It's used to access attributes and methods of the object from within its methods. It is equivalent to `self` in Python or `this` in other languages.

### Python Equivalent

```python
class Counter:
    def __init__(self):
        self.count: int = 0

    def increment(self) -> None:
        self.count = self.count + 1

    def get_count(self) -> int:
        return self.count
```

## Creating and Using Objects

To create an object (an "instance" of a class), you call the class like a function.

```clyp
# Create an instance of the Counter class
let my_counter = Counter();

# Call methods on the object
my_counter.increment();
my_counter.increment();

# Access the result
let current_count = my_counter.get_count();
print("The count is: " + toString(current_count)); # Prints: The count is: 2
```

### Python Equivalent

```python
my_counter = Counter()
my_counter.increment()
my_counter.increment()

current_count = my_counter.get_count()
print(f"The count is: {current_count}")
```
