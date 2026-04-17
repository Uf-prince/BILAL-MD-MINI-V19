const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "fb",
    alias: ["fbdl", "facebook", "reel"],
    desc: "Download FB Video/Reel HD",
    category: "download",
    react: "🔵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Bilal, Facebook link to paste karo!");

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // PrinceTech API URL
        const apiUrl = `https://api.princetechn.com/api/download/facebook?apikey=prince&url=${encodeURIComponent(q)}`;
        
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data.success || !data.result) {
            return reply("❌ API ne response nahi diya. Link valid hai?");
        }

        const { title, hd_video, sd_video, duration } = data.result;

        // Agar HD video link hai toh wo uthayega, warna SD
        const videoLink = hd_video || sd_video;

        const msg = `*🎬 BILAL-MD FB DOWNLOADER*\n\n` +
                    `*📌 Title:* ${title}\n` +
                    `*🕒 Duration:* ${duration}\n` +
                    `*📊 Quality:* ${hd_video ? 'High Definition (HD)' : 'Standard (SD)'}\n\n` +
                    `> *Powered by PrinceTech API*`;

        // Video Send Karein
        await conn.sendMessage(from, {
            video: { url: videoLink },
            caption: msg
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        reply("❌ FB Error: Connection timeout ya invalid API response.");
    }
});
