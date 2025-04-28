# Learn Java

## 🚀 Basics

### Hello World
```java
public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello, Java!");
  }
}
```

### Variables and Functions
```java
int x = 10;
double y = 20.5;

public int add(int a, int b) {
  return a + b;
}
```

## 💡 Intermediate

### Classes and Objects
```java
class Person {
  String name;
  int age;

  Person(String name, int age) {
    this.name = name;
    this.age = age;
  }

  void greet() {
    System.out.println("Hello, my name is " + name);
  }
}
```

### Inheritance
```java
class Animal {
  void sound() {
    System.out.println("Animal sound");
  }
}

class Dog extends Animal {
  void sound() {
    System.out.println("Bark");
  }
}
```

## 🧠 Advanced

### Interfaces and Lambda Expressions
```java
interface MathOperation {
  int operate(int a, int b);
}

MathOperation add = (a, b) -> a + b;
System.out.println(add.operate(5, 3));
```

### Streams API
```java
import java.util.*;
import java.util.stream.*;

List<Integer> numbers = Arrays.asList(1, 2, 3, 4);
numbers.stream()
       .map(n -> n * 2)
       .forEach(System.out::println);
```

