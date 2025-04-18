// models/ChatGptModel.js
const axios = require('axios');

const askChatGpt = async (userMessage) => {
  const apiKey = process.env.OPENAI_API_KEY; // เปิดใช้งาน API key สำหรับ ChatGPT
  const url = 'https://api.openai.com/v1/chat/completions';

  try {
    const response = await axios.post(url, {
      model: 'gpt-3.5-turbo', // หรือใช้รุ่นอื่นที่ต้องการ
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant who only answers questions related to ArtToys. You can reply in Thai or English depending on the user\'s message. If the question is unrelated, respond politely that you only answer ArtToy-related topics.'
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      
      max_tokens: 150,
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const chatGptMessage = response.data.choices[0].message.content;
    return chatGptMessage; // ส่งคำตอบจาก ChatGPT
  } catch (error) {
    console.error('Error contacting ChatGPT:', error.response?.data || error.message);
    return 'Sorry, something went wrong.';
  }
};

module.exports = {
  askChatGpt
};
