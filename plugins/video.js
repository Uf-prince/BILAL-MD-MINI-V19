const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "pin",
    alias: ["pinterest", "ps"],
    desc: "Download or Search Pinterest Media",
    category: "download",
    react: "📌",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        if (!q) return reply("❌ Link to do ya kuch search karne ke liye naam likho! (e.g. .pin neon car)");

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // --- CHECK IF INPUT IS A LINK ---
        if (q.includes("pin.it") || q.includes("pinterest.com")) {
            const res = await axios.get(`https://api.xte.web.id/v3/dl/pinterest?url=${encodeURIComponent(q)}`);
            if (!res.data.status) return reply("❌ Link working nahi hai!");

            const { url, title, is_video } = res.data.result;
            const mediaType = is_video ? { video: { url } } : { image: { url } };

            return await conn.sendMessage(from, {
                ...mediaType,
                caption: `*📌 RESULT:* ${title || 'Pinterest'}\n\n> *Downloaded by BILAL-MD*`,
                contextInfo: {
                    externalAdReply: {
                        title: "BILAL-MD PINTEREST DL",
                        body: "Direct Download",
                        thumbnailUrl: "https://i.postimg.cc/7LWBgYMq/bilal.jpg",
                        sourceUrl: "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G",
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            }, { quoted: mek });
        }

        // --- SEARCH LOGIC (If no link provided) ---
        const searchRes = await axios.get(`https://api.xte.web.id/v3/search/pinterest?q=${encodeURIComponent(q)}`);
        
        if (!searchRes.data.status || !searchRes.data.result.length) {
            return reply("❌ Aapki search ke mutabiq koi photo nahi mili.");
        }

        // Top 1 image bhejne ke liye
        const imgUrl = searchRes.data.result[0]; 

        await conn.sendMessage(from, {
            image: { url: imgUrl },
            caption: `*✨ Pinterest Search:* ${q.toUpperCase()}\n\n> *Downloaded by BILAL-MD*`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "BILAL-MD IMAGE SEARCH",
                    body: `Found result for: ${q}`,
                    thumbnailUrl: "https://i.postimg.cc/7LWBgYMq/bilal.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G",
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        reply("❌ Error: API busy hai ya search limit reach ho gayi.");
    }
});
