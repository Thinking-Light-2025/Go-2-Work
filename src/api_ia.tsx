import axios from 'axios';
require('dotenv').config();

const API_KEY = process.env.A_API_KEY;

if (!API_KEY) {
  throw new Error('Chave da API não definida. Verifique o arquivo .env');
}

export async function iaConexao(message: string) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const reply = response.data.choices[0].message.content.trim();
    return reply;
  } catch (error) {
    console.error('Erro ao falar com Sofia 💔:', error.message);
    return 'Opa, algo deu errado ao tentar falar comigo 😢';
  }
}