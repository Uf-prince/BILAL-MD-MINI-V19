const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "img",
    alias: ["gimg", "image"],
    desc: "Search Images via PrinceTech",
    category: "download",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Bilal, kya dhoondna hai? (e.g. .img neon gaming)");

        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

        // PrinceTech Image API Endpoint
        const apiUrl = `https://api.princetech.my.id/api/search/googleimage?query=${encodeURIComponent(q)}`; 
        const res = await axios.get(apiUrl);
        
        // PrinceTech structure check: res.data.results
        if (!res.data.success || !res.data.results || res.data.results.length === 0) {
            return reply("❌ PrinceTech API ne koi image nahi di.");
        }

        const images = res.data.results.slice(0, 5); 

        for (let i = 0; i < images.length; i++) {
            try {
                await conn.sendMessage(from, {
                    image: { url: images[i] },
                    caption: `*🖼️ Result [${i + 1}/5]*\n*🔍 Query:* ${q.toUpperCase()}\n\n> *BILAL-MD - PrinceTech API*`,
                    contextInfo: {
                        externalAdReply: {
                            title: "BILAL-MD IMAGE SEARCH",
                            body: `Result ${i + 1}`,
                            thumbnailUrl: images[i],
                            sourceUrl: "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G",
                            mediaType: 1,
                            renderLargerThumbnail: false
                        }
                    }
                }, { quoted: mek });

                // Small delay to keep it smooth
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (err) {
                console.log(`Link error at index ${i}`);
                continue; // Agar koi link kharab ho toh agla bhej de
            }
        }

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("PrinceTech Img Error:", e);
        reply("❌ Masla aa gaya! PrinceTech API response nahi de rahi.");
    }
});
