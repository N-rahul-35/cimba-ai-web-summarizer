
---

# 🧾 Issue and Solution: Running Scala Project with Dependencies (Fat JAR and Scala-CLI)

## ❗ Problem

When attempting to run a Scala application using `scala-cli` and a custom JAR file, the following issues were encountered:

### 1. **Multiple Main Classes Error**

```bash
[error] Found several main classes: TestSummarizer, ai.cimba.scalaSummarizer.SummarizerApp
```

✅ **Solution**: Explicitly specify the main class using:

```bash
--main-class TestSummarizer
```

---

### 2. **ClassNotFoundException (e.g., slick.dbio.DBIOAction)**

Even after including Slick in the `build.gradle`:

```gradle
implementation "com.typesafe.slick:slick_2.13:3.4.1"
```

You might still get:

```text
Exception in thread "main" java.lang.NoClassDefFoundError: slick/dbio/DBIOAction
```

💡 **Root Cause**:  
Your `scalaSummarizerAPI-1.0.0.jar` **does not include its dependencies** (like Slick, Postgres, etc.).

---

## ✅ Solution: Build a Fat JAR (Uber JAR)

A **fat JAR** (also called an **uber JAR**) bundles **all your classes and all required dependencies** into one single JAR file. This ensures the JVM can access all referenced classes at runtime.

### 🔧 Steps

1. **Apply the Shadow plugin** in your `build.gradle`:

```gradle
plugins {
    id 'scala'
    id 'java-library'
    id 'maven-publish'
    id 'com.github.johnrengelman.shadow' version '7.1.2' // Add this line
}
```

2. **Run the following Gradle command** to build the fat JAR:

```bash
gradlew shadowJar
```

3. The resulting fat JAR will be located at:

```
build/libs/scalaSummarizerAPI-1.0.0-all.jar
```

---

## ▶️ Running with scala-cli

Make sure to **run using the fat JAR**:

```powershell
scala-cli run TestSummarizer.scala --classpath "F:\CIMBA Assignment\websummarizer\scalaSummarizerAPI\build\libs\scalaSummarizerAPI-1.0.0-all.jar" --main-class TestSummarizer
```

> ✅ Or use backticks (`` ` ``) for line continuation in PowerShell:
>
> ```powershell
> scala-cli run TestSummarizer.scala `
> --classpath "F:\CIMBA Assignment\websummarizer\scalaSummarizerAPI\build\libs\scalaSummarizerAPI-1.0.0-all.jar" `
> --main-class TestSummarizer
> ```

---

## ✅ Summary

| Issue | Fix |
|-------|-----|
| Missing class errors (e.g., Slick) | Build and use a **fat JAR** |
| Multiple main classes | Use `--main-class <ClassName>` |
| Incorrect line continuation | Use **single line** or **backticks (`)** in PowerShell |

---

Let me know if you'd like to automate the fat JAR build or integrate it into CI/CD.