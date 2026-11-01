import { SarvamAIClient } from "sarvamai";

process.loadEnvFile();

const apiKey = process.env.SARVAM_API_KEY;
if (!apiKey) {
  console.error("Error: SARVAM_API_KEY is not set in .env");
  process.exit(1);
}

const client = new SarvamAIClient({
  apiSubscriptionKey: apiKey,
});

async function main() {
  const response = await client.chat.completions({
    model: "sarvam-105b-conversations",
    messages: [
      {
        role: "user",
        content: "Hello! Introduce yourself in one sentence.",
      },
    ],
  });

  const reply = response.choices?.[0]?.message?.content;
  console.log("Sarvam API Response:", reply);
}

main().catch((err) => {
  console.error("API call failed:", err.message);
  process.exit(1);
});
