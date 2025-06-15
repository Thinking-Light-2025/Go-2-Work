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