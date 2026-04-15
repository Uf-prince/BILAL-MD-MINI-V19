hereconst { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "song",
    alias: ["audio", "ytmp3", "play"],
    desc: "Download YouTube Audio",
    category: "download",
    react: "🎶",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        if (!q) return reply("❌ Gaane ka link to do!");

        const apiUrl = `https://api.danzzapi.xyz/api/downloader/youtube?url=${q}&apikey=YOUR_KEY`; 
        const res = await axios.get(apiUrl);
        
        if (!res.data.status) return reply("❌ Audio nahi mil saki!");

        const { title, downloads } = res.data.result;

        await conn.sendMessage(from, {
            audio: { url: downloads.video.url }, // API same link use kar rahi hai audio ke liye bhi
            mimetype: 'audio/mp4',
            ptt: false,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "BILAL-MD AUDIO PLAYER",
                    body: title,
                    thumbnailUrl: "https://i.postimg.cc/7LWBgYMq/bilal.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        reply("❌ Error: " + e.message);
    }
});
