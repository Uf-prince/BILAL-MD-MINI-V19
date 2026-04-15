const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

cmd({
    pattern: "video",
    alias: ["ytv", "vdl"],
    desc: "Search & Download Video (Best Quality)",
    category: "download",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Bilal, video ka naam ya link likho!");

        // 1. Search Logic
        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });
        let videoUrl = q;
        if (!q.includes("youtube.com") && !q.includes("youtu.be")) {
            const search = await yts(q);
            const data = search.videos[0];
            if (!data) return reply("❌ Video nahi mili!");
            videoUrl = data.url;
        }

        // 2. Fetch from API
        const apiUrl = `https://api.xte.web.id/v3/dl/ytmp4?url=${encodeURIComponent(videoUrl)}`;
        const res = await axios.get(apiUrl);
        
        if (!res.data.status) return reply("❌ API server ne response nahi diya.");

        const downloadData = res.data.result;
        const { title, download, thumbnail, quality, duration } = downloadData;

        // 3. Pehle Information bhejein (Fast Response)
        const infoMsg = `*🎬 BILAL-MD VIDEO DOWNLOADER*\n\n` +
                        `*📌 Title:* ${title}\n` +
                        `*📊 Quality:* ${quality}\n` +
                        `*🕒 Duration:* ${duration || 'N/A'}\n\n` +
                        `> *Uploading video file, please wait...*`;

        await conn.sendMessage(from, { 
            image: { url: thumbnail }, 
            caption: infoMsg 
        }, { quoted: mek });

        // 4. Phir Direct Video File bhejein
        await conn.sendMessage(from, {
            video: { url: download },
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`,
            caption: `*✅ Downloaded:* ${title}\n\n> *Powered by Bilal-MD*`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        reply("❌ Masla aa gaya! Shayad file 100MB se bari hai ya net slow hai.");
    }
});
