
---

# 📄 Integrating Scala Fat JAR with Spring Boot Backend

## 📌 Problem

When building and running the Spring Boot backend in a multi-module Gradle project, the backend depends on a Scala module (`scalaSummarizerAPI`). However:

- The default `scalaSummarizerAPI-1.0.0.jar` doesn't include transitive dependencies.
- Trying to use it directly results in **runtime errors** like `ClassNotFoundException` or missing Scala libraries.
- Direct command line testing (e.g., `scala-cli run TestSummarizer.scala`) can result in issues like `os.PathError$LastOnEmptyPath`, and running `--classpath` or `--main-class` via PowerShell fails due to syntax issues.
- Cleaning the project with `./gradlew clean` fails if the JAR is in use.

## ✅ Solution: Use a Fat JAR (All-In-One JAR)

To include all dependencies of the Scala module, we build a **fat JAR** (`scalaSummarizerAPI-1.0.0-all.jar`) using the [Shadow Plugin](https://imperceptiblethoughts.com/shadow/introduction/).

---

## 🛠 Setup Instructions

### 1. ✅ Modify `scalaSummarizerAPI/build.gradle`

```groovy
plugins {
    id 'scala'
    id 'com.github.johnrengelman.shadow' version '7.1.2' // Add this
}

dependencies {
    implementation 'org.scala-lang:scala-library:2.13.12'
    // other dependencies...
}

// This task creates the fat jar
shadowJar {
    archiveClassifier.set('all')
}
```

Run the following command to generate the fat jar:

```bash
./gradlew :scalaSummarizerAPI:shadowJar
```

---

### 2. ✅ Update `backend/build.gradle` to use the fat jar

```groovy
plugins {
    id 'org.springframework.boot'
    id 'io.spring.dependency-management'
    id 'java'
}

group = 'ai.cimba'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '17'

repositories {
    mavenCentral()
    mavenLocal()
    flatDir {
        dirs "${rootProject.projectDir}/scalaSummarizerAPI/build/libs"
    }
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.postgresql:postgresql:42.7.4'
    implementation 'org.scala-lang:scala-library:2.13.12'

    // ✅ Use the fat jar for Scala module
    implementation name: 'scalaSummarizerAPI-1.0.0-all'

    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

tasks.named('compileJava') {
    dependsOn(':scalaSummarizerAPI:shadowJar')
}

test {
    useJUnitPlatform()
}
```

---

### 3. ✅ Running the Backend

To **build and run** everything:

```bash
./gradlew :scalaSummarizerAPI:shadowJar :backend:bootRun
```

To **build only**:

```bash
./gradlew :backend:build
```

---

### 🧹 If You Get Delete Errors During Clean

You may face an error like:

> Unable to delete directory … scalaSummarizerAPI-1.0.0-all.jar is in use.

**Solution**:
- Ensure the JAR is not running in any process.
- Restart IDE or close all terminals using the file.
- Use Task Manager to kill background Java processes if needed.

---

## ✅ Summary

- Build the Scala module using Shadow plugin to get a self-contained fat jar.
- Use `flatDir` + `implementation name:` to include it in the backend.
- Ensure dependencies are resolved using `dependsOn`.

With this setup, the backend can safely use compiled Scala logic without manually copying dependencies or restructuring.

---
