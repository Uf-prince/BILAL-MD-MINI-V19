const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    alias: ["tt", "ttdl"],
    desc: "Download TikTok HD Video",
    category: "download",
    react: "📱",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ TikTok link to paste karo!");

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // PrinceTech API for TikTok
        const apiUrl = `https://api.princetechn.com/api/download/tiktok?url=${encodeURIComponent(q)}`;
        
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data.success || !data.result) {
            return reply("❌ Video nahi mil saki. Link check karein!");
        }

        const { title, video_hd, video, author } = data.result;

        // HD Link ko pehle check karna (FB style logic)
        const finalVideo = video_hd || video;

        await conn.sendMessage(from, {
            video: { url: finalVideo },
            caption: `*🎬 ${title || "TikTok Video"}*\n\n> *Downloaded by BILAL-MD*`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        reply("❌ TikTok Error: API response nahi de rahi.");
    }
});
