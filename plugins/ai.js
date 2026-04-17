const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ai",
    alias: ["gpt", "ask", "bot"],
    desc: "AI Chat Assistant",
    category: "main",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("Ji Bilal, puchiye kya puchna hai?");

        // PrinceTech AI API
        const apiUrl = `https://api.princetechn.com/api/ai/ai?apikey=prince&q=${encodeURIComponent(q)}`;
        
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data.success || !data.result) {
            return reply("Sorry, abhi mere dimaag mein network error chal raha hai.");
        }

        // Direct Answer (No extra text, no ads)
        await reply(data.result);

    } catch (e) {
        console.error(e);
        reply("❌ AI Error: API respond nahi kar rahi.");
    }
});

