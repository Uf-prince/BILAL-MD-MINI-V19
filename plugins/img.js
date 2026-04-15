const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "img",
    alias: ["gimg", "image"],
    desc: "Search and Download 5 Images",
    category: "download",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Bilal, search term to do! (e.g. .img neon car)");

        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

        // PrinceTech API Call
        const apiUrl = `https://api.princetech.my.id/api/search/googleimage?query=${encodeURIComponent(q)}`; 
        const res = await axios.get(apiUrl);
        
        if (!res.data.success || !res.data.results.length) {
            return reply("❌ Koi image nahi mili.");
        }

        // Limit set to 5 images
        const images = res.data.results.slice(0, 5); 

        for (let i = 0; i < images.length; i++) {
            await conn.sendMessage(from, {
                image: { url: images[i] },
                caption: `*✨ Result [${i + 1}/5]*\n*🔍 Query:* ${q.toUpperCase()}\n\n> *Downloaded by BILAL-MD*`,
                contextInfo: {
                    externalAdReply: {
                        title: "BILAL-MD IMAGE SEARCH",
                        body: `Image ${i + 1} of 5`,
                        thumbnailUrl: "https://i.postimg.cc/7LWBgYMq/bilal.jpg",
                        sourceUrl: "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G",
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            }, { quoted: mek });

            // Chota sa delay (1 second) taake ban hone ka khatra na ho
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        reply("❌ Error: API ne 5 images nahi di ya response slow hai.");
    }
});

