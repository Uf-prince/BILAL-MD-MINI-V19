const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "fb",
    alias: ["fbdl", "facebook", "reel"],
    desc: "Download Facebook Videos/Reels",
    category: "download",
    react: "🔵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Bilal, Facebook link to do!");

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // --- API CALL ---
        const apikey = "prince";
        const apiUrl = `https://api.princetechn.com/api/download/facebook?apikey=${apikey}&url=${encodeURIComponent(q)}`;
        const res = await axios.get(apiUrl);
        
        if (!res.data.success || !res.data.result) {
            return reply("❌ Video nahi mil saki. Link check karein ya API down hai.");
        }

        const data = res.data.result;
        const videoUrl = data.hd_video || data.sd_video; // HD pehle try karega, warna SD
        const title = data.title || "Facebook Video";
        const duration = data.duration || "N/A";

        // Professional Branding
        const branding = {
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
                title: "BILAL-MD FB DOWNLOADER",
                body: `Duration: ${duration}`,
                thumbnailUrl: data.thumbnail || "https://i.postimg.cc/7LWBgYMq/bilal.jpg",
                sourceUrl: "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G",
                mediaType: 1,
                renderLargerThumbnail: false
            }
        };

        // Send Video
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: `*✨ TITLE:* ${title}\n*🕒 DURATION:* ${duration}\n\n> *Downloaded by BILAL-MD*`,
            contextInfo: branding
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("FB Download Error:", e);
        reply("❌ Error: API response nahi de rahi.");
    }
});

