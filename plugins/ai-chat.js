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
        if (!q) return reply("❌ Bilal, TikTok link to do!");

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // PrinceTech API URL (Link ko encode lazmi karna)
        const apiUrl = `https://api.prince.co.ke/api/download/tiktok?url=${encodeURIComponent(q)}`;
        
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data.success || !data.result) {
            return reply("❌ API response nahi de rahi. Link check karein.");
        }

        const { title, video_hd, author, duration } = data.result;

        const msg = `*📱 BILAL-MD TIKTOK DOWNLOADER*\n\n` +
                    `*📝 Title:* ${title}\n` +
                    `*👤 Author:* ${author.name}\n` +
                    `*🕒 Duration:* ${duration}s\n\n` +
                    `> *Powered by PrinceTech API*`;

        // HD Video Send Karein
        await conn.sendMessage(from, {
            video: { url: video_hd },
            caption: msg
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        reply("❌ TikTok Error: Connection failed!");
    }
});
