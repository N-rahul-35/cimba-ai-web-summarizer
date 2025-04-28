# Learn TypeScript

## 🚀 Basics

### Hello World
```ts
let message: string = "Hello, TypeScript!";
console.log(message);
```

### Types
```ts
let count: number = 10;
let isDone: boolean = false;
let items: string[] = ["apple", "banana"];
```

### Functions
```ts
function add(a: number, b: number): number {
  return a + b;
}
```

## 💡 Intermediate

### Interfaces
```ts
interface Person {
  name: string;
  age: number;
}

let user: Person = { name: "Alice", age: 25 };
```

### Classes
```ts
class Animal {
  constructor(public name: string) {}

  move(distance: number) {
    console.log(`${this.name} moved ${distance}m.`);
  }
}
```

## 🧠 Advanced

### Generics
```ts
function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>("myString");
```

### Type Guards
```ts
function isNumber(x: any): x is number {
  return typeof x === "number";
}
```

### Utility Types
```ts
interface Todo {
  title: string;
  completed: boolean;
}

let todo: Partial<Todo> = { title: "Do homework" };
```

