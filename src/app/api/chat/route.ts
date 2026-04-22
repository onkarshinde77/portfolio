import { NextRequest, NextResponse } from "next/server";

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

    // Check for required env vars
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const pineconeKey = process.env.PINECONE_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // If no API keys, use fallback mode
    if (!anthropicKey || !pineconeKey || !openaiKey) {
      return fallbackResponse(message);
    }

    // 1. Embed user query
    const { OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: openaiKey });

    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: message
    });
    const queryVector = embeddingRes.data[0].embedding;

    // 2. Query Pinecone
    const { Pinecone } = await import("@pinecone-database/pinecone");
    const pinecone = new Pinecone({ apiKey: pineconeKey });
    const indexName = process.env.PINECONE_INDEX ?? "portfolio-kb";
    const index = pinecone.index(indexName);

    const queryResult = await index.query({
      vector: queryVector,
      topK: 5,
      includeMetadata: true
    });

    const contextChunks = queryResult.matches
      ?.map(m => m.metadata?.content as string)
      .filter(Boolean)
      .join("\n\n---\n\n");

    // 3. Build system prompt with context
    const systemPrompt = `You are an AI assistant embedded in Onkar Shinde's portfolio website. Your job is to answer questions about Onkar — his projects, skills, background, and how to contact him. Be helpful, concise, and accurate.

Use the following context retrieved from Onkar's knowledge base:

<context>
${contextChunks || "No specific context found. Use general knowledge about the portfolio."}
</context>

Guidelines:
- Answer only based on the context provided and what you know about the portfolio
- Be concise but complete
- If asked for links (GitHub, LinkedIn, etc.), provide them from the context
- If you don't know something, say so clearly
- Respond in a friendly, professional tone
- Do not make up projects, scores, or technical details`;

    // 4. Stream response from Claude
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const anthropic = new Anthropic({ apiKey: anthropicKey });

    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        ...history.slice(-8).map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content
        })),
        { role: "user", content: message }
      ]
    });

    // 5. Return SSE stream
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const data = JSON.stringify({ text: event.delta.text });
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

function fallbackResponse(message: string): NextResponse {
  const lower = message.toLowerCase();

  let response = "";

  if (lower.includes("project") || lower.includes("built") || lower.includes("system")) {
    response =
      "Onkar has built 6 production-grade AI systems including: **Multi-Hop QA System** (87% faithfulness), **Domain-Adaptive Fine-Tuning Pipeline** (LoRA/QLoRA on Llama-3/Mistral), **ReAct Agent Framework** (multi-agent orchestration), **Semantic Search Engine** (1M+ docs, sub-100ms), **LLM Eval Harness** (15+ metrics), and a **Lightweight MLOps Platform**. Each ships with a custom eval harness.";
  } else if (lower.includes("stack") || lower.includes("tech") || lower.includes("skill")) {
    response =
      "Onkar's core stack: **LLMs** (OpenAI GPT-4, Anthropic Claude, Llama, Mistral), **RAG** (Pinecone, Weaviate, LangChain), **Fine-tuning** (PEFT/LoRA, PyTorch, FSDP, DeepSpeed), **MLOps** (W&B, Docker, FastAPI, vLLM), **Frontend** (Next.js, TypeScript), **Infra** (AWS, GCP, GitHub Actions).";
  } else if (lower.includes("resume") || lower.includes("cv") || lower.includes("download")) {
    response =
      "You can download Onkar's resume at `/resume.pdf` or click the **Download Resume** button in the Contact section. He is a second-year B.E. AI & Data Science student at DY Patil College of Engineering Akurdi, Pune (2023-2027), GPA 8.34. Available for internships now.";
  } else if (lower.includes("contact") || lower.includes("email") || lower.includes("reach")) {
    response =
      "You can reach Onkar at **onkarshinde.ai@gmail.com**, or connect on [GitHub](https://github.com/onkarshinde77), [LinkedIn](https://linkedin.com/in/onkarshinde77), or [HuggingFace](https://huggingface.co/onkarshinde77). He typically responds within 24 hours.";
  } else {
    response =
      "I'm Onkar's AI assistant. I can tell you about his **projects** (RAG systems, fine-tuning pipelines, agent frameworks), **tech stack** (PyTorch, LangChain, Pinecone, Next.js), how to **contact him**, or where to find his **resume**. What would you like to know?";
  }

  const encoder = new TextEncoder();
  const words = response.split(" ");
  const readable = new ReadableStream({
    async start(controller) {
      for (const word of words) {
        await new Promise(r => setTimeout(r, 30));
        const data = JSON.stringify({ text: word + " " });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
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
}
