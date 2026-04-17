const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "video",
    alias: ["mp4", "ytv"],
    desc: "Download YouTube Video via Gifted API",
    category: "download",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Bilal, link ya video ka naam do!");

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // API URL (Apikey 'gifted' hi rehne dena agar tumhare paas apni nahi hai)
        const apiUrl = `https://api.giftedtech.co.ke/api/download/dlmp4?apikey=gifted&url=${encodeURIComponent(q)}`;
        
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data.success || !data.result) {
            return reply("❌ API ne response nahi diya. Shayad link sahi nahi hai.");
        }

        const { title, thumbnail, download_url } = data.result;

        const msg = `*🎬 BILAL-MD VIDEO DOWNLOADER*\n\n` +
                    `*📌 Title:* ${title}\n` +
                    `*📊 Status:* Success\n\n` +
                    `> *Powered by GiftedTech API*`;

        // Video Send Karein
        await conn.sendMessage(from, {
            video: { url: download_url },
            caption: msg
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        reply("❌ Error: API connection mein masla hai.");
    }
});
