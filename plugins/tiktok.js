const { cmd } = require('../command');
const { tiktokdl } = require('@mrnima/tiktok-downloader');

cmd({
    pattern: "tiktok",
    alias: ["tt", "ttdl"],
    desc: "Download TikTok Video",
    category: "download",
    react: "📱",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ TikTok link lazmi hai!");
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const data = await tiktokdl(q);
        if (!data || !data.result) return reply("❌ Video nahi mil saki!");

        await conn.sendMessage(from, {
            video: { url: data.result.video_no_watermark },
            caption: `*📝 Title:* ${data.result.title}\n*👤 User:* ${data.result.author}\n\n> *Downloaded by BILAL-MD*`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        reply("❌ TikTok Error: " + e.message);
    }
});
