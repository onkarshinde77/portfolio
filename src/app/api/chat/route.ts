import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  message: string;
  history: Message[];
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { message, history } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;

    if (!groqKey) {
      return NextResponse.json({ error: "API key is not configured. Please set GROQ_API_KEY." }, { status: 500 });
    }

    // Read mydata.md for RAG context
    const mydataPath = path.join(process.cwd(), "src", "data", "mydata.md");
    let mydataContent = "";
    try {
      mydataContent = fs.readFileSync(mydataPath, "utf8");
    } catch (e) {
      console.error("Could not read mydata.md", e);
      mydataContent = "No specific context found.";
    }

    const systemPrompt = `You are a strict, helpful AI assistant embedded in Onkar Shinde's portfolio website. 
Your ONLY job is to answer questions about Onkar using EXACTLY and ONLY the provided context from his markdown file.

<context>
${mydataContent}
</context>

Guidelines:
- If the answer is NOT in the context, politely reply: "I'm sorry, but I can only provide information that is explicitly stated in my knowledge base."
- DO NOT use any outside knowledge. DO NOT hallucinate details, projects, or statistics.
- DO NOT use Markdown formatting like asterisks (* or **), hashes (#), or plus signs (+). 
- When listing information like projects or skills, use plain text with line breaks instead of bullets. For example:
Project Name: [Name]
Description: [Desc]
Technologies Used:
[Tech 1]
[Tech 2]
Features:
[Feature 1]
[Feature 2]
Status: [Status]
GitHub Link:
[Link]
- Only list items that have explicitly provided details in the context. Do NOT create empty placeholders.
- DO NOT answer general questions unless they directly relate to Onkar's profile.
- Answer according to the question asked, referencing the specific data provided.
- Be concise, professional, and friendly.`;

    const { OpenAI } = await import("openai");
    const groq = new OpenAI({ 
      apiKey: groqKey,
      baseURL: "https://api.groq.com/openai/v1"
    });

    const stream = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        ...history.slice(-8).map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content
        })),
        { role: "user", content: message }
      ]
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) {
            const data = JSON.stringify({ text });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
      }
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
