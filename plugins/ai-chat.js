const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ai",
    alias: ["ask", "gpt"],
    desc: "Ask anything from AI",
    category: "main",
    react: "🧠",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Bilal, kuch poochein to sahi! (e.g. .ai coding kya hai?)");

        // Processing reaction
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // XTE API Call
        const apiUrl = `https://api.xte.web.id/v3/ai/askai?q=${encodeURIComponent(q)}`;
        const res = await axios.get(apiUrl);
        
        // Agar status true ho aur result mein text ho
        if (res.data.status && res.data.result) {
            const aiResponse = res.data.result;

            await conn.sendMessage(from, {
                text: `*🤖 BILAL-MD AI ASSISTANT*\n\n${aiResponse}\n\n> *Powered by Bilal-MD*`,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    externalAdReply: {
                        title: "BILAL-MD ARTIFICIAL INTELLIGENCE",
                        body: "Online & Ready to Help",
                        thumbnailUrl: "https://i.postimg.cc/7LWBgYMq/bilal.jpg",
                        sourceUrl: "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G",
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            }, { quoted: mek });
        } else {
            reply("❌ AI server se koi jawab nahi aaya.");
        }

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        reply("❌ Error: API Down hai ya net ka masla hai.");
    }
});
