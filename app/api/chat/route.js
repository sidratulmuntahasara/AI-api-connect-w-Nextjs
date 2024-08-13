```
======================= IF YOU'RE USING OPENROUTER API KEY =======================

import { NextResponse } from 'next/server'; // Import NextResponse from Next.js for handling responses
import OpenAI from 'openai'; // Import OpenAI library for interacting with the OpenAI API

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = "Use your own system prompt here"; // Add your system prompt here

// POST function to handle incoming requests
export async function POST(req) {
  try {
    //Create a new instance of the OpenAI client
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY, // **********====== ALL YOU HAVE TO DO IS CHANGE THIS LINE ======**********
        defaultHeaders: {
          "HTTP-Referer": 'http://localhost:3000/', // Optional, for including your app on openrouter.ai rankings.
          "X-Title": 'Put_Your_AI_name_HERE', // Optional. Shows in rankings on openrouter.ai.
        }
    });

    const data = await req.json(); // Parse the JSON body of the incoming request
    console.log("Request data:", data); // Log the request data for debugging

    // Validate that data is an array
    if (!Array.isArray(data)) {
      throw new Error("Invalid input: data should be an array of messages.");
    }

    // Create a chat completion request to the OpenRouter API
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }, ...data], // Include the system prompt and user messages
      model: "gpt-4o-mini",  // **********====== ALL YOU HAVE TO DO IS SPECIFY THE MODEL ======**********
      stream: true, // Enable streaming responses
    });

    // Create a ReadableStream to handle the streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder(); // Create a TextEncoder to convert strings to Uint8Array
        try {
          // Iterate over the streamed chunks of the response
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content; // Extract the content from the chunk
            if (content) {
              const text = encoder.encode(content); // Encode the content to Uint8Array
              controller.enqueue(text); // Enqueue the encoded text to the stream
            }
          }
        } catch (err) {
          controller.error(err); // Handle any errors that occur during streaming
        } finally {
          controller.close(); // Close the stream when done
        }
      },
    });

    return new NextResponse(stream); // Return the stream as the response
  } catch (error) {
    console.error("Error in POST /api/chat:", error); // Log the error for debugging
    return NextResponse.json({ error: error.message }, { status: 400 }); // Return a 400 Bad Request response with the error message
  }
}

```

// ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

```
======================= IF YOU'RE USING TOGETHER.AI API KEY =======================

import { NextResponse } from 'next/server'; // Import NextResponse from Next.js for handling responses
import Together from "together-ai";

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = "Use your own system prompt here"; // Add your system prompt here

// POST function to handle incoming requests
export async function POST(req) {
  try {
    const together = new Together({  // Create a new instance of the TogetherAI client
      baseURL: "https://api.together.xyz/v1",
      apiKey: process.env.TOGETHER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": 'http://localhost:3000/', // Optional.
        "X-Title": 'Put_Your_AI_name_HERE', // Optional.
      }
    });

    const data = await req.json(); // Parse the JSON body of the incoming request
    console.log("Request data:", data); // Log the request data for debugging

    // Validate that data is an array
    if (!Array.isArray(data)) {
      throw new Error("Invalid input: data should be an array of messages.");
    }

    // Create a chat completion request to the OpenAI API
    const completion = await together.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }, ...data], // Include the system prompt and user messages
      model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo", // Specify the model to use
      stream: true, // Enable streaming responses
    });

    // Create a ReadableStream to handle the streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder(); // Create a TextEncoder to convert strings to Uint8Array
        try {
          // Iterate over the streamed chunks of the response
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content; // Extract the content from the chunk
            if (content) {
              const text = encoder.encode(content); // Encode the content to Uint8Array
              controller.enqueue(text); // Enqueue the encoded text to the stream
            }
          }
        } catch (err) {
          controller.error(err); // Handle any errors that occur during streaming
        } finally {
          controller.close(); // Close the stream when done
        }
      },
    });

    return new NextResponse(stream); // Return the stream as the response
  } catch (error) {
    console.error("Error in POST /api/chat:", error); // Log the error for debugging
    return NextResponse.json({ error: error.message }, { status: 400 }); // Return a 400 Bad Request response with the error message
  }
}

```