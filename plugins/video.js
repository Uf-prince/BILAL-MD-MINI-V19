const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "video",
    alias: ["ytmp4", "vdl", "ytv"],
    desc: "Download YouTube Videos/Shorts (XTE API)",
    category: "download",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        if (!q) return reply("❌ Bilal, YouTube link to do! (Shorts ya Video)");

        // Processing reaction
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // XTE YouTube API Call
        const apiUrl = `https://api.xte.web.id/v3/dl/ytmp4?url=${encodeURIComponent(q)}`;
        const res = await axios.get(apiUrl);
        
        if (!res.data.status || !res.data.result) {
            return reply("❌ Video nahi mil saki. API limit ya link ka masla ho sakta hai.");
        }

        const data = res.data.result;
        const videoUrl = data.download; // Direct MP4 link
        const title = data.title || "YouTube Video";
        const quality = data.quality || "720p";

        // Professional Branding
        const branding = {
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
                title: "BILAL-MD YOUTUBE DL",
                body: `Quality: ${quality} | ${title}`,
                thumbnailUrl: "https://i.postimg.cc/7LWBgYMq/bilal.jpg",
                sourceUrl: "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G",
                mediaType: 1,
                renderLargerThumbnail: false
            }
        };

        // Send Video to User
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: `*✨ TITLE:* ${title}\n*📊 QUALITY:* ${quality}\n\n> *Downloaded by BILAL-MD*`,
            contextInfo: branding
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("YT Download Error:", e);
        reply("❌ Error: API server response nahi de raha.");
    }
});
