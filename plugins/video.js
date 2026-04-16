const { cmd } = require('../command');
const { ytmp4 } = require('@dark-yasiya/yt-dl.js');
const yts = require('yt-search');

cmd({
    pattern: "video",
    alias: ["mp4", "ytv"],
    desc: "Download YouTube Video",
    category: "download",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Bilal, video ka naam ya link do!");

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // Search for the video
        const search = await yts(q);
        const data = search.videos[0];
        if (!data) return reply("❌ Kuch nahi mila!");

        // Download Video via Library
        const download = await ytmp4(data.url);

        const msg = `*🎬 BILAL-MD VIDEO DOWNLOADER*\n\n` +
                    `*📌 Title:* ${data.title}\n` +
                    `*🕒 Duration:* ${data.timestamp}\n\n` +
                    `> *Uploading video file...*`;

        await conn.sendMessage(from, {
            video: { url: download.download_url },
            caption: msg
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        reply("❌ Video Error: " + e.message);
    }
});
