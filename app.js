const { useState } = React;

const DiwaliChatbot = () => {
  const [userName, setUserName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [connection, setConnection] = useState('');
  const [language, setLanguage] = useState('hinglish');
  const [tone, setTone] = useState('spiritual');
  const [shayari, setShayari] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateShayari = async () => {
    setIsLoading(true);
    try {
      console.log('Sending request to generate-shayari function with:', { userName, recipientName, connection, language, tone });
      
      const queryParams = new URLSearchParams({
        userName,
        recipientName,
        connection,
        language,
        tone
      }).toString();
      
      const response = await fetch(`/.netlify/functions/generate-shayari?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Received response:', response);
      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);

      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing JSON:', e);
        throw new Error('Invalid JSON in response');
      }

      console.log('Parsed response data:', data);

      if (data.shayari) {
        setShayari(data.shayari);
      } else {
        throw new Error('No shayari in response');
      }
    } catch (error) {
      console.error('Error generating shayari:', error);
      setShayari(`An error occurred: ${error.message}. Please try again or contact support.`);
    } finally {
      setIsLoading(false);
    }
  };

  const shareShayari = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Diwali Shayari',
        text: shayari,
        url: window.location.href,
      }).then(() => {
        console.log('Shared successfully');
      }).catch((error) => {
        console.error('Error sharing:', error);
      });
    } else {
      alert('Web Share API not supported in your browser. You can copy the shayari manually.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-yellow-400 p-8 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto bg-white bg-opacity-90 shadow-lg border-2 border-yellow-300 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-yellow-100 opacity-30"></div>
        <div className="relative z-10 p-6">
          <h2 className="text-2xl font-bold text-red-600 text-center mb-6">Diwali Shayari Generator</h2>
          <form className="space-y-4">
            <input
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3 py-2 border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              placeholder="Recipient's Name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full px-3 py-2 border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              placeholder="Something that brings you closer"
              value={connection}
              onChange={(e) => setConnection(e.target.value)}
              className="w-full px-3 py-2 border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="hinglish">Hinglish</option>
              <option value="hindi">Hindi</option>
              <option value="english">English</option>
            </select>
            <div className="flex space-x-2 justify-center">
              {['humorous', 'spiritual', 'professional'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`px-3 py-1 rounded ${tone === t ? 'bg-yellow-400 text-red-700' : 'bg-red-500 text-yellow-100'}`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex space-x-2">
              <button 
                type="button"
                onClick={generateShayari} 
                disabled={isLoading || !userName || !recipientName || !connection}
                className="flex-grow bg-yellow-400 hover:bg-yellow-500 text-red-700 font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Generating...' : 'Generate Shayari'}
              </button>
              <button
                type="button"
                onClick={shareShayari}
                disabled={!shayari}
                className="bg-red-500 hover:bg-red-600 text-yellow-100 font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Share
              </button>
            </div>
          </form>
          {shayari && (
            <div className="mt-4 p-4 bg-red-100 rounded-md border-2 border-yellow-400">
              <p className="text-center italic text-red-700">{shayari}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<DiwaliChatbot />, document.getElementById('root'));
