# Learn Scala

## 🚀 Basics

### Hello World
```scala
object HelloWorld {
  def main(args: Array[String]): Unit = {
    println("Hello, Scala!")
  }
}
```

### Variables and Functions
```scala
val x: Int = 10
var y: Int = 20

def add(a: Int, b: Int): Int = a + b
```

## 💡 Intermediate

### Collections and Pattern Matching
```scala
val nums = List(1, 2, 3, 4)
nums.map(_ * 2).foreach(println)

val number = 2
number match {
  case 1 => println("One")
  case 2 => println("Two")
  case _ => println("Other")
}
```

### Case Classes
```scala
case class Person(name: String, age: Int)
val p = Person("Alice", 25)
```

## 🧠 Advanced

### Higher-Order Functions
```scala
def operate(x: Int, y: Int, f: (Int, Int) => Int): Int = f(x, y)
val result = operate(5, 3, _ + _)
```

### Futures for Concurrency
```scala
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

val f = Future {
  Thread.sleep(1000)
  42
}
f.map(println)
```

