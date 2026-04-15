const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "video",
    alias: ["ytmp4", "vdl"],
    desc: "Download YouTube Video",
    category: "download",
    react: "🎥",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        if (!q) return reply("❌ Link to do yar!");

        const apiUrl = `https://api.danzzapi.xyz/api/downloader/youtube?url=${q}&apikey=YOUR_KEY`; // Yahan apni API ka link set karein
        const res = await axios.get(apiUrl);
        
        if (!res.data.status) return reply("❌ Video nahi mili!");

        const { title, downloads } = res.data.result;

        await conn.sendMessage(from, {
            video: { url: downloads.video.url },
            caption: `*✨ TITLE:* ${title}\n\n> *Downloaded by BILAL-MD*`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "BILAL-MD VIDEO DOWNLOADER",
                    body: title,
                    thumbnailUrl: "https://i.postimg.cc/7LWBgYMq/bilal.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G",
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });

    } catch (e) {
        reply("❌ Error: " + e.message);
    }
});

