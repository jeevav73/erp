const { OpenAI } = require('openai');
const { runQuery, allQuery } = require('../database/connection');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateContent(topic, contentType, userId) {
    if (!topic || !contentType) {
      throw new Error('Topic and content type are required');
    }

    const validContentTypes = ['Social Media', 'Blog', 'Email'];
    if (!validContentTypes.includes(contentType)) {
      throw new Error('Invalid content type. Valid types: Social Media, Blog, Email');
    }

    const prompts = {
      'Social Media': `Create an engaging social media caption about "${topic}". Make it catchy, use relevant emojis, and keep it under 280 characters.`,
      'Blog': `Write a compelling blog post introduction about "${topic}". It should be 2-3 paragraphs, informative, and engaging.`,
      'Email': `Write a professional email subject line and preview text about "${topic}". Subject line should be catchy and preview should be 2-3 lines.`
    };

    try {
      const message = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompts[contentType]
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      const generatedContent = message.choices[0].message.content;

      // Save to database
      const query = `
        INSERT INTO ai_content (topic, content_type, generated_content, created_by)
        VALUES (?, ?, ?, ?)
      `;
      await runQuery(query, [topic, contentType, generatedContent, userId || null]);

      return {
        topic,
        content_type: contentType,
        generated_content: generatedContent
      };
    } catch (error) {
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }

  async getContentHistory(userId) {
    const query = `
      SELECT * FROM ai_content
      WHERE created_by = ?
      ORDER BY created_at DESC
      LIMIT 50
    `;
    return allQuery(query, [userId]);
  }

  async getAllContent() {
    const query = `
      SELECT * FROM ai_content
      ORDER BY created_at DESC
      LIMIT 100
    `;
    return allQuery(query);
  }
}

module.exports = AIService;
