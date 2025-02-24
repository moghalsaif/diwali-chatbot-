const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event, context) {
  console.log('Function invoked with event:', JSON.stringify(event));
  
  let userName, recipientName, connection, language, tone;

  if (event.httpMethod === 'GET') {
    ({ userName, recipientName, connection, language, tone } = event.queryStringParameters);
  } else if (event.httpMethod === 'POST') {
    ({ userName, recipientName, connection, language, tone } = JSON.parse(event.body));
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  console.log('Parsed inputs:', { userName, recipientName, connection, language, tone });

  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      throw new Error('GEMINI_API_KEY is not set');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    const prompt = `You are an expert in creating personalized Diwali shayaris. Generate a heartfelt and culturally appropriate shayari based on the following inputs:

1. Sender's Name: ${userName}
2. Recipient's Name: ${recipientName}
3. Shared Connection: ${connection}
4. Type of Shayari: ${tone}
   - Humorous: Light-hearted, funny, and playful Diwali wishes.
   - Spiritual: Focus on the deeper meaning of Diwali, including light, prosperity, and the victory of good over evil.
   - Professional: Formal and respectful Diwali wishes suitable for a work or business setting.
5. Language: ${language} (Hindi, English, or Hinglish)

Guidelines:
- Create a short, warm, and festive Diwali greeting (2-4 lines).
- Incorporate the names of the sender and recipient creatively.
- Reference the shared connection to make it more personal.
- Include themes of light, joy, prosperity, or new beginnings associated with Diwali.
- Adapt the style and complexity based on the chosen type and language.
- For Hinglish, blend Hindi and English naturally and appropriately.
- Ensure the tone matches the selected type (humorous, spiritual, or professional).

What to avoid:
- Political, controversial religious topics, or divisive social issues.
- Offensive humor, body-shaming, or potentially hurtful jokes.
- Inappropriate language, slang, or profanity.
- Complex or abstract references unrelated to Diwali.
- Negativity or pessimism; maintain a positive and celebratory tone.
- Overly lengthy or complicated expressions.

Remember: The goal is to create a personalized, meaningful, and appropriate Diwali greeting that resonates with both the sender and the recipient while respecting the festival's spirit.`;

    console.log('Sending prompt to Gemini API:', prompt);

    const result = await model.generateContent(prompt);
    console.log('Received result from Gemini API');

    const response = await result.response;
    const shayari = response.text();
    console.log('Generated shayari:', shayari);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust this in production
      },
      body: JSON.stringify({ shayari }),
    };
  } catch (error) {
    console.error('Error in generate-shayari function:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Adjust this in production
      },
      body: JSON.stringify({ error: error.message || "Failed to generate shayari" }),
    };
  }
};
