from fastapi import FastAPI, HTTPException,WebSocket
from fastapi.middleware.cors import CORSMiddleware
import os
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from openai import OpenAI
import requests
from bs4 import BeautifulSoup
import html2text
import asyncio
import aiohttp
from urllib.parse import urlparse
import uvicorn
import logging

# # Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)


# loading variables from .env file
load_dotenv()

app = FastAPI(title="Website Summarizer API")

# Initialize OpenAI client with Gemini configuration
client = OpenAI(
    api_key=os.getenv("GEMINI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SummarizeRequest(BaseModel):
    url: str
    max_length: Optional[int] = None


class SummarizeResponse(BaseModel):
    summary: str
    title: str
    source_url: str



@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message received: {data}")
    except Exception as e:
        logging.error(f"WebSocket error: {e}")
    finally:
        await websocket.close()
#summarize up to max length of the content
async def fetch_website_content(url: str) -> dict:
    """Fetch website content with proper headers and error handling"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }

    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers, timeout=30) as response:
                if response.status != 200:
                    raise HTTPException(
                        status_code=response.status,
                        detail=f"Failed to fetch website content: HTTP {response.status}"
                    )

                content_type = response.headers.get('Content-Type', '').lower()
                if 'text/html' not in content_type:
                    raise HTTPException(
                        status_code=400,
                        detail="URL does not point to a HTML webpage"
                    )

                html_content = await response.text()

                # Parse the HTML
                soup = BeautifulSoup(html_content, 'html.parser')

                # Remove unwanted elements
                for element in soup(['script', 'style', 'nav', 'footer', 'iframe', 'head']):
                    element.decompose()

                # Get title
                title = soup.title.string if soup.title else urlparse(url).netloc

                # Convert HTML to plain text
                h = html2text.HTML2Text()
                h.ignore_links = True
                h.ignore_images = True
                h.ignore_tables = True
                h.ignore_emphasis = True
                h.body_width = 0  # Don't wrap text at a specific width
                text_content = h.handle(str(soup))

                # Clean up the text while preserving important whitespace
                # Remove multiple newlines and spaces while preserving paragraph structure
                cleaned_text = '\n'.join(
                    ' '.join(line.split())
                    for line in text_content.split('\n')
                    if line.strip()
                )

                return {
                    "title": title.strip(),
                    "content": cleaned_text,  # No length limit
                    "success": True
                }

    except asyncio.TimeoutError:
        raise HTTPException(
            status_code=504,
            detail="Request timed out while fetching website content"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching website content: {str(e)}"
        )

#
async def summarize_content(content: str, title: str, url: str, max_length: int =300)-> dict:
    """Summarize the website content using Gemini API with a 200-word limit"""
    try:
        # Split content into chunks if it's too long
        content_chunks = [content[i:i + 8000] for i in range(0, len(content), 8000)]
        summaries = []

        for chunk in content_chunks:
            response = client.chat.completions.create(
                model="gemini-2.0-flash",
                messages=[
                    {
                        "role": "system",
                        "content": """You are an AI assistant that provides concise website summaries.
                        Your task is to create summaries that are EXACTLY 300 WORDS OR LESS.
                        Focus on the most essential information while maintaining clarity and readability.
                        Include only the most important points and key details."""
                    },
                    {
                        "role": "user",
                        "content": f"""Summarize this website content in EXACTLY 200 WORDS OR LESS.
                        Website: {url}
                        Title: {title}
                        Content: {chunk}

                        Requirements:
                        1. Summary must be 300 words or less
                        2. Focus on main purpose and key information
                        3. Be clear and concise
                        4. Maintain professional tone
                        5. Include most important details only

                        Current timestamp: 2025-04-26 20:56:07
                        User: N-rahul-35"""
                    }
                ]
            )

            summaries.append(response.choices[0].message.content.strip())

        # If there are multiple chunks, consolidate them
        if len(summaries) > 1:
            final_response = client.chat.completions.create(
                model="gemini-2.0-flash",
                messages=[
                    {
                        "role": "system",
                        "content": """You are an AI assistant that consolidates summaries.
                        Create a FINAL summary that is EXACTLY 200 WORDS OR LESS.
                        Focus only on the most crucial information."""
                    },
                    {
                        "role": "user",
                        "content": f"""Consolidate these summaries into one FINAL summary of 300 WORDS OR LESS:
                        {" ".join(summaries)}

                        Requirements:
                        1. Final summary must be 300 words or less
                        2. Include only the most important information
                        3. Make it coherent and well-structured
                        4. Maintain professional tone

                        Current timestamp: 2025-04-26 20:56:07
                        User: N-rahul-35"""
                    }
                ]
            )

            final_summary = final_response.choices[0].message.content.strip()
        else:
            final_summary = summaries[0]

        # Verify summary length and truncate if necessary
        words = final_summary.split()
        if len(words) > 300:
            final_summary = ' '.join(words[:300])+'...'

        return {
            "summary": final_summary,
            "title": title,
            "success": True
        }

    except Exception as e:
        print(f"Error in summarization: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating summary: {str(e)}"
        )

@app.get("/")
async def root():
    return {"message": "Welcome to the Website Summarizer API", "available_endpoints": ["/summarize", "/health"]}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/summarize", response_model=SummarizeResponse)
async def summarize_url(request: SummarizeRequest):
    """Summarize the content of a website"""
    try:
        # Validate URL format
        parsed_url = urlparse(request.url)
        if not all([parsed_url.scheme, parsed_url.netloc]):
            raise HTTPException(
                status_code=400,
                detail="Invalid URL format. URL must include http:// or https://"
            )

        # Fetch website content
        content_result = await fetch_website_content(request.url)

        if not content_result["success"]:
            raise HTTPException(
                status_code=500,
                detail="Failed to fetch website content"
            )

        # Generate summary
        summary_result = await summarize_content(
            content_result["content"],
            content_result["title"],
            request.url,
            request.max_length
        )

        return SummarizeResponse(
            summary=summary_result["summary"],
            title=summary_result["title"],
            source_url=request.url
        )

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    # Configure Uvicorn with proper settings
    uvicorn.run(
        "app:app",  # replace 'main' with your actual Python file name
        host="0.0.0.0",
        port=8000,
        reload=True,  # Enable auto-reload during development
        log_level="info",
        workers=1,
        loop="asyncio",
        http="h11",  # Explicitly set HTTP protocol
        ws="websockets",  # Explicitly set WebSocket protocol
        timeout_keep_alive=65,
        access_log=True
    )