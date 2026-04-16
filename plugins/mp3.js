const { cmd } = require('../command');
const { ytmp3 } = require('@dark-yasiya/yt-dl.js');
const yts = require('yt-search');

cmd({
    pattern: "song",
    alias: ["mp3", "play"],
    desc: "Download YouTube Audio",
    category: "download",
    react: "🎶",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Bilal, gaane ka naam ya link to do!");
        
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // Search for the video
        const search = await yts(q);
        const data = search.videos[0];
        if (!data) return reply("❌ Kuch nahi mila!");

        // Download Audio via Library
        const download = await ytmp3(data.url);

        const msg = `*🎶 BILAL-MD SONG DOWNLOADER*\n\n` +
                    `*📌 Title:* ${data.title}\n` +
                    `*🕒 Duration:* ${data.timestamp}\n` +
                    `*🔗 Link:* ${data.url}\n\n` +
                    `> *Uploading audio file...*`;

        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: msg }, { quoted: mek });

        // Send as Audio/Voice
        await conn.sendMessage(from, {
            audio: { url: download.download_url },
            mimetype: 'audio/mpeg',
            fileName: `${data.title}.mp3`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        reply("❌ MP3 Error: " + e.message);
    }
});
