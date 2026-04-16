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

        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

        // Search logic with validation
        const search = await yts(q);
        const data = search.videos[0];
        if (!data || !data.url) return reply("❌ Bilal, YouTube par ye video nahi mili!");

        // Download logic with safety check
        const download = await ytmp4(data.url);
        
        // Checking if download link exists to avoid 'toString' error
        if (!download || !download.download_url) {
            return reply("❌ Sorry Bilal, Library download link generate nahi kar saki. Try again!");
        }

        const msg = `*🎬 BILAL-MD VIDEO DOWNLOADER*\n\n` +
                    `*📌 Title:* ${data.title}\n` +
                    `*🕒 Duration:* ${data.timestamp}\n\n` +
                    `> *Powered by BILAL-MD Premium*`;

        await conn.sendMessage(from, {
            video: { url: download.download_url },
            caption: msg
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("YT Video Error:", e);
        // Error message ko handle kiya taake crash na ho
        reply("❌ Masla aa gaya! Shayad video bohot bari hai ya link dead hai.");
    }
});
