const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

cmd({
    pattern: "video",
    alias: ["ytv", "v"],
    desc: "Search and Direct Video Downloader",
    category: "download",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("Video ka naam ya link do!");

        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

        let videoUrl = q;

        // Agar user ne link nahi diya toh search karega
        if (!q.includes("youtube.com") && !q.includes("youtu.be")) {
            const search = await yts(q);
            const data = search.videos[0];
            if (!data) return reply("❌ Bilal yar, kuch nahi mila!");
            videoUrl = data.url;
        }

        // PrinceTech API se download link lena
        const apiUrl = `https://api.princetechn.com/api/download/dlmp4?apikey=prince&url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(apiUrl);
        const resData = response.data;

        if (!resData.success || !resData.result) {
            return reply("❌ Video download nahi ho saki!");
        }

        // Direct Video Message
        await conn.sendMessage(from, {
            video: { url: resData.result.download_url },
            caption: `*${resData.result.title}*`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        reply("❌ Error: API ne response nahi diya.");
    }
});
