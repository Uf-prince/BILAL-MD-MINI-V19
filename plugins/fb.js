const { cmd } = require('../command');
const { facebookdl } = require('@mrnima/facebook-downloader');

cmd({
    pattern: "fb",
    alias: ["fbdl", "facebook"],
    desc: "Download FB Video",
    category: "download",
    react: "🔵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ FB Video link do!");
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const data = await facebookdl(q);
        // Pehle HD check karega, agar nahi toh pehla available link
        const video = data.result.find(v => v.quality === '720p (HD)') || data.result[0];

        await conn.sendMessage(from, {
            video: { url: video.url },
            caption: `*🎬 FB Video Downloaded*\n*📊 Quality:* ${video.quality}\n\n> *BILAL-MD Premium Scraper*`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        reply("❌ FB Error: " + e.message);
    }
});
