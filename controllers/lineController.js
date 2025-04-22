// controllers/lineController.js
// const ChatGptModel = require('../models/ChatGptModel.js');
const chatGptModel = require('../models/chatGptModel');

// ฟังก์ชันที่รับคำขอจาก Webhook ของ LINE
const handleWebhook = async (req, res) => {
  try {
    const { events } = req.body;
    for (let event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const userMessage = event.message.text;

        // เรียกใช้ model สำหรับการถามข้อมูลจาก ChatGPT
        const chatGptResponse = await chatGptModel.askChatGpt(userMessage); 

        // ส่งข้อความตอบกลับไปที่ LINE
        const replyToken = event.replyToken;
        await replyToUser(replyToken, chatGptResponse);
      }
    }
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).send('Error');
  }
};

// ฟังก์ชันตอบกลับข้อความจาก LINE
const replyToUser = async (replyToken, fullMessage) => {
    const axios = require('axios');
    const lineApiUrl = 'https://api.line.me/v2/bot/message/reply';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
    };
  
    // LINE จำกัดไว้ที่ 5 ข้อความต่อ reply และแต่ละข้อความไม่เกิน 2000 ตัวอักษร
    const MAX_MESSAGES = 5;
    const MAX_CHARS_PER_MESSAGE = 1500; // เผื่อไว้นิด
  
    const chunks = [];
    for (let i = 0; i < fullMessage.length && chunks.length < MAX_MESSAGES; i += MAX_CHARS_PER_MESSAGE) {
      chunks.push({
        type: 'text',
        text: fullMessage.substring(i, i + MAX_CHARS_PER_MESSAGE)
      });
    }
  
    const body = {
      replyToken: replyToken,
      messages: chunks
    };
  
    try {
      await axios.post(lineApiUrl, body, { headers });
    } catch (error) {
      console.error('Error sending reply:', error.response?.data || error.message);
    }
  };
  

module.exports = {
  handleWebhook
};
