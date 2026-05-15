const apiKey = process.env.GROQ_API_KEY;

async function testKey() {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/models", {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });
    console.log("Status:", res.status);
    const data = await res.json();
    if (res.ok) {
      console.log("Success! Key is valid.");
    } else {
      console.log("Error:", data);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

testKey();
