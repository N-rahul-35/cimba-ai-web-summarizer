import ai.cimba.scalaSummarizer.SummarizerLibrary

object TestSummarizer {
  def main(args: Array[String]): Unit = {
    val testUrl = "https://cimba.ai"

    try {
      println(s"Testing summarization for: $testUrl")
      val summary = SummarizerLibrary.summarize(testUrl)
      println("\n=== Summary ===\n" + summary)
    } catch {
      case e: Exception =>
        println("Error: " + e.getMessage)
    }
  }
}
