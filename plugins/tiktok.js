const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    alias: ["tt", "ttdl"],
    desc: "Download TikTok with Multi-API Fallback",
    category: "download",
    react: "📱",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ TikTok link to paste karo!");

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const encodedUrl = encodeURIComponent(q);
        
        // Sab APIs ki list
        const apis = [
            `https://api.princetechn.com/api/download/tiktokdlv4?apikey=prince&url=${encodedUrl}`,
            `https://api.princetechn.com/api/download/tiktokdlv3?apikey=prince&url=${encodedUrl}`,
            `https://api.princetechn.com/api/download/tiktokdlv2?apikey=prince&url=${encodedUrl}`
        ];

        let resultData = null;

        // Loop jo har API ko check karega
        for (let url of apis) {
            try {
                const response = await axios.get(url);
                if (response.data && response.data.success && response.data.result) {
                    resultData = response.data.result;
                    break; // Agar data mil gaya toh loop rok do
                }
            } catch (err) {
                console.log("Next API try kar raha hoon...");
                continue; // Agar ek API fail hui toh ag li check karo
            }
        }

        if (!resultData) {
            return reply("❌ Saari APIs fail ho gayin. Link check karein ya baad mein try karein.");
        }

        // HD video ko priority dena
        const finalVideo = resultData.video_hd || resultData.video || resultData.url;

        await conn.sendMessage(from, {
            video: { url: finalVideo },
            caption: `*🎬 ${resultData.title || "TikTok Video"}*\n\n> *Downloaded by BILAL-MD*`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        reply("❌ TikTok Error: System busy hai.");
    }
});
