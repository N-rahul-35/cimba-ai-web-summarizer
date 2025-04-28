# Learn Python

## 🚀 Basics

### Hello World
```python
print("Hello, Python!")
```

### Variables and Data Types
```python
x = 10      # Integer
y = 3.14    # Float
name = "Alice"  # String
is_active = True  # Boolean
```

### Functions
```python
def greet(name):
    return f"Hello, {name}!"
```

## 💡 Intermediate

### Lists, Tuples, Dictionaries
```python
my_list = [1, 2, 3]
my_tuple = (4, 5, 6)
my_dict = {"name": "Alice", "age": 25}
```

### Loops and Conditionals
```python
for i in range(5):
    print(i)

if x > 5:
    print("x is greater than 5")
```

### Classes and Objects
```python
class Person:
    def __init__(self, name):
        self.name = name

    def greet(self):
        return f"Hello, {self.name}"
```

## 🧠 Advanced

### List Comprehensions
```python
squares = [x * x for x in range(10)]
```

### Decorators
```python
def decorator(func):
    def wrapper():
        print("Before function call")
        func()
        print("After function call")
    return wrapper

@decorator
def say_hello():
    print("Hello!")
```

### Asyncio
```python
import asyncio

async def say_hello():
    await asyncio.sleep(1)
    print("Hello asynchronously")

asyncio.run(say_hello())
```

