const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "pin",
    alias: ["pinterest", "ps"],
    desc: "Search and Download Pinterest Images",
    category: "download",
    react: "📌",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        if (!q) return reply("❌ Kya search karna hai? (e.g. .pin logo design)");

        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

        // Link check: Agar user ne direct link diya ho
        if (q.includes("pin.it") || q.includes("pinterest.com")) {
            const res = await axios.get(`https://api.d2-ye.my.id/api/download/pinterest?url=${q}`);
            if (!res.data.status) return reply("❌ Media nahi mil saki!");
            
            const { media, title } = res.data.result;
            return await conn.sendMessage(from, {
                image: { url: media },
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

        // --- SEARCH LOGIC (Agar sirf naam likha ho) ---
        const searchRes = await axios.get(`https://api.d2-ye.my.id/api/search/pinterest?query=${q}`);
        
        if (!searchRes.data.status || !searchRes.data.result.length) {
            return reply("❌ Aapki search ke mutabiq koi photo nahi mili.");
        }

        // Pehli 3 images bhejne ke liye (Loop laga diya hai)
        const results = searchRes.data.result.slice(0, 1); // Abhi sirf 1 bhej raha hoon, aap limit barha sakte hain

        for (let img of results) {
            await conn.sendMessage(from, {
                image: { url: img },
                caption: `*✨ Pinterest Search:* ${q.toUpperCase()}\n\n> *Downloaded by BILAL-MD*`,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    externalAdReply: {
                        title: "BILAL-MD IMAGE SEARCH",
                        body: `Result for: ${q}`,
                        thumbnailUrl: "https://i.postimg.cc/7LWBgYMq/bilal.jpg",
                        sourceUrl: "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G",
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        reply("❌ Error: Search API filhal kaam nahi kar rahi.");
    }
});

