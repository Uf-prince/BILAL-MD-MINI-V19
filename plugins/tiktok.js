const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    alias: ["tt", "tiktokdl"],
    desc: "Download TikTok Video & Audio",
    category: "download",
    react: "📱",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        if (!q) return reply("❌ TikTok link to do Bilal!");

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // API Call (JSON structure ke mutabiq)
        const apiUrl = `https://api.d2-ye.my.id/api/download/tiktok?url=${q}`; // Example Free API
        const res = await axios.get(apiUrl);
        
        if (!res.data.status) return reply("❌ Video nahi mil saki!");

        const data = res.data.result.data;
        const title = data.title || "TikTok Video";
        const videoUrl = data.play; // Without watermark link
        const audioUrl = data.music; // Audio link

        // 1. Send Video
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: `*✨ TITLE:* ${title}\n\n> *Downloaded by BILAL-MD*`,
            contextInfo: {
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
            }
        }, { quoted: mek });

        // 2. Send Audio
        await conn.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            ptt: false
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        reply("❌ Error: API response nahi de rahi.");
    }
});

