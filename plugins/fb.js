const { cmd } = require('../command');
const fb = require('@mrnima/facebook-downloader'); // Direct require

cmd({
    pattern: "fb",
    alias: ["fbdl", "facebook", "reel"],
    desc: "Download FB Video/Reel",
    category: "download",
    react: "🔵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Bilal, FB link to paste karo!");
        
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // Library structure check: library.facebookdl(q) use karein
        const data = await fb.facebookdl(q);
        
        if (!data || !data.result || data.result.length === 0) {
            return reply("❌ Video nahi mil saki! Shayad link private hai ya invalid.");
        }

        // HD quality ko dhoondna, warna pehla link uthana
        const video = data.result.find(v => v.quality === '720p (HD)') || data.result[0];

        await conn.sendMessage(from, {
            video: { url: video.url },
            caption: `*🎬 BILAL-MD FB DOWNLOADER*\n*📊 Quality:* ${video.quality}\n\n> *Powered by BILAL-MD Premium*`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        reply("❌ FB Error: Library response nahi de rahi. Ek baar link check karein.");
    }
});
