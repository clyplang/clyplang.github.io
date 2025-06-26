# Standard Library

Clyp comes with a standard library of useful functions and classes.

## I/O

### `read_file(str file_path) returns str`

Reads the entire content of a file into a string.

```clyp
let content = read_file("my_file.txt");
print(content);
```

### `write_file(str file_path, str content) returns void`

Writes a string of content to a file, overwriting it if it exists.

```clyp
write_file("new_file.txt", "Hello from Clyp!");
```

## Network

### `fetch(str url) returns Response`

Makes an HTTP GET request to a URL and returns a `Response` object.

```clyp
let response = fetch("https://api.github.com");
let content = response.text();
let json_data = response.json();
print(content);
```

### `ping(str host) returns bool`

Pings a host to check for reachability.

```clyp
if (ping("google.com")) {
    print("Google is reachable.");
}
```

## Data Structures

### `chunk(list items, int size) returns list[list]`

Splits a list into smaller lists (chunks) of a specified size.

```clyp
list[int] numbers = [1, 2, 3, 4, 5, 6];
list[list[int]] chunks = chunk(numbers, 2);
print(chunks); # Prints: [[1, 2], [3, 4], [5, 6]]
```

### `flatten(list list_of_lists) returns list`

Flattens a list of lists into a single list.

```clyp
list[list[int]] nested = [[1, 2], [3, 4]];
list[int] flat = flatten(nested);
print(flat); # Prints: [1, 2, 3, 4]
```

## Utilities

### `toString(any value) returns str`

Converts any value to its string representation.

### `slugify(str text) returns str`

Converts text into a URL-friendly slug.

```clyp
let slug = slugify("My Awesome Clyp Article!");
print(slug); # Prints: my-awesome-clyp-article
```

### `is_empty(any value) returns bool`

Checks if a value (string, list, dict) is empty or `null`.

### `is_prime(int n) returns bool`

Checks if a number is a prime number.

### `to_roman_numerals(int num) returns str`

Converts an integer (1-3999) to a Roman numeral.

### `chance(float percentage) returns bool`

Returns `true` with a given probability.

```clyp
if (chance(25.5)) {
    print("25.5% chance event occurred!");
}
```

## Decorators

Decorators are special functions that modify other functions.

### `@trace`

Prints the arguments and return value of a function call.

```clyp
@trace
def add(int a, int b) returns int {
    return a + b;
}
add(2, 3); # Will print call and return info
```

### `@cache(ttl)`

Caches the result of a function for a time-to-live (TTL) duration. `ttl` can be a number in seconds or a string like `'5m'`.

```clyp
@cache('10s')
def slow_api_call() returns str {
    # ... takes a long time ...
    return "some data";
}
```

### `@memoize`

Caches function results indefinitely based on arguments.

### `@time_it`

Measures and prints the execution time of a function.
