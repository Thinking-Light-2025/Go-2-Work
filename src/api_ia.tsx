import axios from 'axios';

const API_KEY = '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';

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