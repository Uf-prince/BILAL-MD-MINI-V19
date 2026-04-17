const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    alias: ["tt", "ttdl"],
    desc: "Direct TikTok Downloader",
    category: "download",
    react: "📱",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("TikTok link to do!");

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // PrinceTech TikTok API
        const apiUrl = `https://api.princetechn.com/api/download/tiktok?url=${encodeURIComponent(q)}`;
        
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data.success || !data.result) {
            return reply("Nahi mili! Link sahi se check karo.");
        }

        // Direct HD Video Send (Bina watermark ke)
        await conn.sendMessage(from, {
            video: { url: data.result.video_hd || data.result.video },
            caption: `*${data.result.title || "TikTok Video"}*`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        reply("Error: TikTok API response fail.");
    }
});
