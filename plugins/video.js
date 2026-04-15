const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "video",
    alias: ["vdl", "ytmp4"],
    desc: "Download Video from New API",
    category: "download",
    react: "📥",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        if (!q) return reply("❌ Link to do Bilal!");

        // Reaction
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // API Call (Yahan wahi link lagayein jahan se ye JSON aaya hai)
        const apiUrl = `https://api.d2-ye.my.id/api/download/ytdl?url=${q}`; 
        const res = await axios.get(apiUrl);
        
        if (!res.data.status) return reply("❌ Video nahi mil saki!");

        const { title, download, quality } = res.data.result;

        // Sending Video with Branding
        await conn.sendMessage(from, {
            video: { url: download },
            caption: `*✨ TITLE:* ${title}\n*📊 QUALITY:* ${quality}\n\n> *Downloaded by BILAL-MD*`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "BILAL-MD VIDEO DL",
                    body: `Quality: ${quality}`,
                    thumbnailUrl: "https://i.postimg.cc/7LWBgYMq/bilal.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G",
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        reply("❌ Error: API limit ya server ka masla hai.");
    }
});
