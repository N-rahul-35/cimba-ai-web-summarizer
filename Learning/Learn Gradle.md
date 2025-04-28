# Learn Gradle

## 🚀 Basics

### Hello World Build Script
```groovy
// build.gradle
apply plugin: 'java'

repositories {
    mavenCentral()
}

dependencies {
    implementation 'com.google.guava:guava:31.1-jre'
}
```

### Running Tasks
```bash
gradle build
gradle clean
gradle run
```

## 💡 Intermediate

### Custom Task
```groovy
task hello {
    doLast {
        println 'Hello from Gradle!'
    }
}
```

### Multi-Project Builds
```groovy
// settings.gradle
include 'app', 'library'
```

```groovy
// app/build.gradle
dependencies {
    implementation project(':library')
}
```

## 🧠 Advanced

### Using Kotlin DSL
```kotlin
plugins {
    java
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib")
}
```

### Task Configuration Avoidance API
```groovy
tasks.register('myTask') {
    doLast {
        println 'Optimized task!'
    }
}
```

### Publishing Artifacts
```groovy
publishing {
    publications {
        mavenJava(MavenPublication) {
            from components.java
        }
    }
    repositories {
        maven {
            url = uri("file://${buildDir}/repo")
        }
    }
}
```

