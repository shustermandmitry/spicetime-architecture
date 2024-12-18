// Placeholder: Generate embeddings

const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({ apiKey: 'YOUR_OPENAI_API_KEY' });
const openai = new OpenAIApi(configuration);

async function generateEmbedding(content) {
  const response = await openai.createEmbedding({
    input: content,
    model: 'text-embedding-ada-002',
  });
  return response.data.data[0].embedding;
}

module.exports = generateEmbedding;