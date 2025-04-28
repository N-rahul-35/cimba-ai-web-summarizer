// File: scalaSummarizerAPI/src/main/scala/ai/cimba/scalaSummarizer/SummarizerLibrary.scala
//> using lib "com.typesafe.slick::slick:3.4.1"
//> using lib "org.postgresql:postgresql:42.7.3"

package ai.cimba.scalaSummarizer

import java.net.URI
import java.net.http.{HttpClient, HttpRequest, HttpResponse}
import java.time.Duration
import java.sql.Timestamp
import org.jsoup.Jsoup
import slick.jdbc.PostgresProfile.api._

import scala.concurrent.Await
import scala.concurrent.duration._
import scala.util.{Failure, Success, Try}


object SummarizerLibrary {

  // PostgreSQL DB Config
  private val dbConfig = Database.forURL(
    url = "jdbc:postgresql://localhost:5432/websummarizer",
    user = "postgres",
    password = "rahul",
    driver = "org.postgresql.Driver"
  )

  // Table schema
  private class RequestLogs(tag: Tag) extends Table[(Long, String, String, Timestamp)](tag, "request_logs") {
    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
    def url = column[String]("url")
    def status = column[String]("status")
    def timestamp = column[Timestamp]("timestamp")
    def * = (id, url, status, timestamp)
  }

  private val requestLogs = TableQuery[RequestLogs]

  /** Public API: Summarize a URL */
  def summarize(url: String): String = {
    println(s"Starting summarization for: $url")
    logRequest(url, "STARTED")

    val result = for {
      content <- Try(fetchWebContent(url))
      summary <- Try(callPythonService(content, url))
    } yield summary

    result match {
      case Success(summary) =>
        logRequest(url, "COMPLETED")
        println(s"Summary completed successfully for: $url")
        summary

      case Failure(e) =>
        val errorMsg = s"Summarization failed: ${e.getMessage}"
        println(errorMsg)
        logRequest(url, s"ERROR: ${e.getMessage}")
        throw new RuntimeException(errorMsg)
    }
  }

  /** Fetch and parse HTML content from a URL */
  private def fetchWebContent(url: String): String = {
    println(s"Fetching web content for: $url")
    val doc = Jsoup.connect(url)
      .userAgent("Mozilla/5.0")
      .timeout(10000)
      .get()

    val title = doc.title()
    val body = doc.body().text()
    s"Title: $title\n\nContent: $body"
  }

  /** Send text to Python summarizer and return result */
  private def callPythonService(content: String, originalUrl: String): String = {
    println("Calling Python summarizer API...")
    val client = HttpClient.newBuilder()
      .connectTimeout(Duration.ofSeconds(30))
      .build()

    val jsonPayload =
      s"""{"content": "${escapeJson(content)}", "url": "${escapeJson(originalUrl)}"}"""

    val request = HttpRequest.newBuilder()
      .uri(URI.create("http://localhost:8000/summarize"))
      .header("Content-Type", "application/json")
      .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
      .build()

    val response = client.send(request, HttpResponse.BodyHandlers.ofString())

    if (response.statusCode() == 200) {
      val responseBody = response.body()
      val summaryPattern = """"summary"\s*:\s*"([^"]+)"""".r

      summaryPattern.findFirstMatchIn(responseBody) match {
        case Some(m) =>
          m.group(1).replace("\\n", "\n").replace("\\\"", "\"")
        case None =>
          throw new RuntimeException("Invalid response: summary field not found.")
      }
    } else {
      throw new RuntimeException(s"HTTP ${response.statusCode()}: ${response.body()}")
    }
  }

  /** Log each request in the DB */
  private def logRequest(url: String, status: String): Unit = {
    val insertAction = requestLogs += (
      0L, url, status, new Timestamp(System.currentTimeMillis())
    )

    Try {
      Await.result(dbConfig.run(insertAction), 5.seconds)
    } match {
      case Success(_) => println(s"Logged [$status] for $url")
      case Failure(e) => println(s"Logging failed: ${e.getMessage}")
    }
  }

  /** Escape JSON string */
  private def escapeJson(str: String): String = {
    str.replace("\\", "\\\\")
      .replace("\"", "\\\"")
      .replace("\n", "\\n")
      .replace("\r", "\\r")
      .replace("\t", "\\t")
  }
}

object SummarizerApp {
  def main(args: Array[String]): Unit = {
    if (args.length != 1) {
      println("Usage: scala SummarizerApp <url>")
    } else {
      val summarizer =  SummarizerLibrary
      val result = summarizer.summarize(args(0))
      println(s"\n--- Summary Result ---\n$result")
    }
  }
}
