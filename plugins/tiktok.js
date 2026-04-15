const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    alias: ["tt", "ttdl"],
    desc: "Download TikTok Video & Audio (XTE API)",
    category: "download",
    react: "📱",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        if (!q) return reply("❌ Bilal, TikTok link to do!");

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // XTE API Call (Ismein url parameter lazmi hai)
        const apiUrl = `https://api.xte.web.id/v3/dl/tiktok?url=${encodeURIComponent(q)}`;
        const res = await axios.get(apiUrl);
        
        if (!res.data.status) return reply("❌ Video nahi mil saki, link check karein.");

        const data = res.data.result;
        const videoUrl = data.video; // No-Watermark video link
        const audioUrl = data.audio; // MP3 link
        const title = data.title || "TikTok Video";

        // Branding Setup
        const branding = {
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
                title: "BILAL-MD TIKTOK DL",
                body: title,
                thumbnailUrl: "https://i.postimg.cc/7LWBgYMq/bilal.jpg",
                sourceUrl: "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G",
                mediaType: 1,
                renderLargerThumbnail: false
            }
        };

        // 1. Send Video
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: `*✨ TITLE:* ${title}\n\n> *Downloaded by BILAL-MD*`,
            contextInfo: branding
        }, { quoted: mek });

        // 2. Send Audio (Optional: Agar sirf audio chahiye ho)
        await conn.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            ptt: false
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        reply("❌ Error: XTE API filhal busy hai.");
    }
});
