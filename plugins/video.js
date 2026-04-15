const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    alias: ["tt", "ttdl"],
    desc: "Download TikTok Video (XTE API)",
    category: "download",
    react: "📱",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Bilal, TikTok link to do!");

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // XTE TikTok API Call
        const apiUrl = `https://api.xte.web.id/v3/dl/tiktok?url=${encodeURIComponent(q)}`;
        const res = await axios.get(apiUrl);
        
        if (!res.data.status || !res.data.result) {
            return reply("❌ Video nahi mil saki. Link check karein.");
        }

        const data = res.data.result;
        const videoUrl = data.video; // No-Watermark MP4 Link
        const title = data.title || "TikTok Video";
        const author = data.author || "User";

        // 1. Send Info Message with Thumbnail
        const infoMsg = `*📱 BILAL-MD TIKTOK DL*\n\n` +
                        `*👤 Author:* ${author}\n` +
                        `*📝 Title:* ${title}\n\n` +
                        `> *Uploading video file...*`;

        await conn.sendMessage(from, { 
            image: { url: data.thumbnail || "https://i.postimg.cc/7LWBgYMq/bilal.jpg" }, 
            caption: infoMsg 
        }, { quoted: mek });

        // 2. Send Only Video File (No Audio separately)
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: `*✅ Video Downloaded Successfully*\n\n> *Powered by BILAL-MD*`,
            mimetype: 'video/mp4',
            fileName: `${author}_tiktok.mp4`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("TikTok DL Error:", e);
        reply("❌ Error: API response nahi de rahi.");
    }
});
