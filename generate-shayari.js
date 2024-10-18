exports.handler = async function(event, context) {
  console.log('Function invoked with event:', JSON.stringify(event));
  
  try {
    const { userName, recipientName, connection, language, tone } = JSON.parse(event.body);
    console.log('Parsed inputs:', { userName, recipientName, connection, language, tone });

    const shayari = `Happy Diwali, ${recipientName}! ${userName} wishes that your ${connection} shines brighter than all the diyas this festive season. (${tone} tone in ${language})`;
    console.log('Generated mock shayari:', shayari);

    return {
      statusCode: 200,
      body: JSON.stringify({ shayari }),
    };
  } catch (error) {
    console.error('Error in simplified generate-shayari function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Failed to generate shayari" }),
    };
  }
};
