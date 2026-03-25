const { GoogleGenerativeAI } = require('@google/generative-ai');
const { runQuery, allQuery } = require('../database/connection');

class AIService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && process.env.DEMO_MODE !== 'true') {
      this.genai = new GoogleGenerativeAI(apiKey);
      // Use gemini-pro by default (most stable). Can be overridden with GEMINI_MODEL env var
      const modelName = process.env.GEMINI_MODEL || 'gemini-pro';
      this.model = this.genai.getGenerativeModel({ model: modelName });
    }
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
      let generatedContent;
      
      // If Gemini API key is not set or demo mode is enabled, use mock content
      if (!process.env.GEMINI_API_KEY || process.env.DEMO_MODE === 'true') {
        generatedContent = this.getMockContent(topic, contentType);
      } else {
        const result = await this.model.generateContent(prompts[contentType]);
        generatedContent = result.response.text();
      }

      // Save to database
      const query = `
        INSERT INTO ai_content (topic, content_type, generated_content, created_by)
        VALUES (?, ?, ?, ?)
      `;
      const result = await runQuery(query, [topic, contentType, generatedContent, userId || null]);
      const aiContentId = result.id;

      // Also create a content_production entry (workflow) and a contributions record
      try {
        await runQuery(`
          INSERT INTO content_production
            (title, ai_content_id, content_type, body, created_by, status)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [topic, aiContentId, contentType, generatedContent, userId || null, 'Draft']);

        await runQuery(`
          INSERT INTO contributions
            (title, description, contribution_type, source, ai_generated, ai_content_id, created_by, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          `${contentType} - ${topic}`,
          generatedContent.substring(0, 100),
          contentType,
          'Content',
          1,
          aiContentId,
          userId || null,
          'Draft'
        ]);
      } catch (err) {
        // If additional inserts fail, log but don't prevent returning generated content
        console.error('Failed to create content_production/contribution records:', err.message);
      }

      return {
        topic,
        content_type: contentType,
        generated_content: generatedContent
      };
    } catch (error) {
      if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')) {
        throw new Error('Gemini API quota exceeded. Please check your plan at https://makersuite.google.com/app/apikey or set DEMO_MODE=true in .env');
      }
      if (error.message.includes('404') || error.message.includes('not found') || error.message.includes('not supported')) {
        const modelName = process.env.GEMINI_MODEL || 'gemini-pro';
        throw new Error(`Gemini model "${modelName}" not found or not supported. Try setting GEMINI_MODEL=gemini-pro in .env or enable DEMO_MODE=true`);
      }
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }

  getMockContent(topic, contentType) {
    const mocks = {
      'Social Media': `🚀 Exciting news about ${topic}! Don't miss out on this game-changing opportunity. Learn more today! 💡 #innovation #${topic.replace(/\s+/g, '')}`,
      'Blog': `Understanding ${topic} in 2024\n\nIn today's fast-paced world, ${topic} has become increasingly important. This comprehensive guide explores the key aspects and benefits.\n\nWhether you're new to ${topic} or looking to deepen your knowledge, we'll cover everything you need to know about this transformative topic.`,
      'Email': `Subject: 📢 Discover the Power of ${topic} Today!\n\nPreview: Learn how ${topic} can revolutionize your business and drive real results. Get exclusive insights, expert tips, and proven strategies...`
    };
    return mocks[contentType] || `Generated content about: ${topic}`;
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
