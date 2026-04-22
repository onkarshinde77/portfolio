/**
 * Pinecone Knowledge Base Seeder
 * 
 * Usage:
 *   npx tsx scripts/seed-pinecone.ts
 * 
 * Env vars required:
 *   OPENAI_API_KEY
 *   PINECONE_API_KEY
 *   PINECONE_INDEX (default: portfolio-kb)
 */

import { knowledgeBase } from "../src/data/knowledge-base";

interface EmbeddingResult {
  id: string;
  values: number[];
  metadata: Record<string, string> & { content: string };
}

async function embedChunks(chunks: typeof knowledgeBase): Promise<EmbeddingResult[]> {
  const { default: OpenAI } = await import("openai");
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  console.log(`Embedding ${chunks.length} chunks...`);
  const results: EmbeddingResult[] = [];

  // Process in batches of 10
  const batchSize = 10;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const inputs = batch.map(c => c.content);

    const res = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: inputs
    });

    batch.forEach((chunk, j) => {
      results.push({
        id: chunk.id,
        values: res.data[j].embedding,
        metadata: {
          ...chunk.metadata,
          content: chunk.content,
          category: chunk.category
        }
      });
    });

    console.log(`  Embedded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunks.length / batchSize)}`);
  }

  return results;
}

async function upsertToPinecone(vectors: EmbeddingResult[]): Promise<void> {
  const { Pinecone } = await import("@pinecone-database/pinecone");

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!
  });

  const indexName = process.env.PINECONE_INDEX ?? "portfolio-kb";

  // Ensure index exists
  const existingIndexes = await pinecone.listIndexes();
  const indexExists = existingIndexes.indexes?.some(
    idx => idx.name === indexName
  );

  if (!indexExists) {
    console.log(`Creating Pinecone index: ${indexName}...`);
    await pinecone.createIndex({
      name: indexName,
      dimension: 1536, // text-embedding-3-small dimension
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1"
        }
      }
    });

    // Wait for index to be ready
    console.log("Waiting for index to be ready...");
    await new Promise(r => setTimeout(r, 5000));
  }

  const index = pinecone.index(indexName);

  // Upsert in batches
  const batchSize = 50;
  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize);
    await index.upsert(batch);
    console.log(
      `  Upserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(vectors.length / batchSize)}`
    );
  }

  console.log(`✅ Successfully seeded ${vectors.length} vectors to Pinecone index "${indexName}"`);
}

async function main() {
  console.log("🌱 Starting knowledge base seeding...\n");

  const missingVars = ["OPENAI_API_KEY", "PINECONE_API_KEY"].filter(
    v => !process.env[v]
  );

  if (missingVars.length > 0) {
    console.error(
      `❌ Missing environment variables: ${missingVars.join(", ")}`
    );
    process.exit(1);
  }

  try {
    const vectors = await embedChunks(knowledgeBase);
    await upsertToPinecone(vectors);
    console.log("\n🎉 Knowledge base seeding complete!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

main();
