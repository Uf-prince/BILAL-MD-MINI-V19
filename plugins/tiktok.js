const { cmd } = require('../command');
const tiktok = require('@mrnima/tiktok-downloader'); // Direct require

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
        if (!q) return reply("❌ Bilal, TikTok link lazmi hai!");
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // Library check: Kuch versions mein 'ttdl' hota hai aur kuch mein direct function
        const data = await tiktok.tiktokdl(q); 
        
        if (!data || !data.result) return reply("❌ Video nahi mil saki! Link check karein.");

        await conn.sendMessage(from, {
            video: { url: data.result.video_no_watermark },
            caption: `*📝 Title:* ${data.result.title || 'No Title'}\n*👤 User:* ${data.result.author || 'Unknown'}\n\n> *Downloaded by BILAL-MD*`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
        console.error(e);
        // Agar 'tiktokdl' fail ho toh alternate method try karein
        reply("❌ TikTok Error: Library response nahi de rahi. Link valid hai?");
    }
});
