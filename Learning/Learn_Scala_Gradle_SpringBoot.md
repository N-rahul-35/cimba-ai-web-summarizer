
# Learn How to Use a Simple Addition Library Made in Scala (Gradle) to Spring Boot (Gradle)

## 🚀 Introduction
In this guide, we will show you how to create a simple addition library using Scala and integrate it into a Spring Boot application, both using Gradle as the build tool.

---

## 📦 Scala Simple Addition Library

1. **Create a Scala Library:**

   First, let's create a simple addition library in Scala. The `Addition` object will contain a method for adding two numbers.

```scala
// src/main/scala/com/example/Add.scala
package com.example

object Add {
  def sum(a: Int, b: Int): Int = {
    a + b
  }
}
```

2. **Gradle Build Configuration (for Scala):**

In your `build.gradle` file, add the Scala plugin and dependencies:

```groovy
plugins {
  id 'scala'
}

repositories {
  mavenCentral()
}

dependencies {
  implementation 'org.scala-lang:scala-library:2.13.6'
}
```

3. **Build the Scala Library:**

```bash
./gradlew build
```

---

## 🧑‍💻 Spring Boot Setup

1. **Create a Spring Boot Application:**

Set up a new Spring Boot project using Gradle. Here's an example `build.gradle` for Spring Boot:

```groovy
plugins {
  id 'org.springframework.boot' version '2.5.4'
  id 'java'
}

repositories {
  mavenCentral()
}

dependencies {
  implementation 'org.springframework.boot:spring-boot-starter-web'
}
```

2. **Integrate Scala Library into Spring Boot:**

In the Spring Boot application, create a service class that uses the `Add` object from the Scala library.

```java
// src/main/java/com/example/AdditionService.java
package com.example;

import org.springframework.stereotype.Service;

@Service
public class AdditionService {

  public int addNumbers(int a, int b) {
    return Add.sum(a, b);
  }
}
```

---

## 🔧 Run the Spring Boot Application

1. **Run the Application:**

```bash
./gradlew bootRun
```

2. **Call the Add API:**

For example, create a REST controller to call the `addNumbers` method.

```java
// src/main/java/com/example/AdditionController.java
package com.example;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdditionController {

  private final AdditionService additionService;

  public AdditionController(AdditionService additionService) {
    this.additionService = additionService;
  }

  @GetMapping("/add")
  public int add(@RequestParam int a, @RequestParam int b) {
    return additionService.addNumbers(a, b);
  }
}
```

---

## ✅ Conclusion

In this tutorial, you learned how to create a simple addition library in Scala, integrate it into a Spring Boot application, and use Gradle for building and managing both projects.
