const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "img",
    alias: ["gimg", "googleimage", "image"],
    desc: "Search and Download Google Images",
    category: "download",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("photos download krne k lie Ese likho .img cats");

        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

        // PrinceTech Google Image API
        const apiUrl = `https://api.princetechn.com/api/search/googleimage?apikey=prince&query=${encodeURIComponent(q)}`;
        
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data.success || !data.results || data.results.length === 0) {
            return reply("Dubara koshish kre");
        }

        // Pahilya 5 images pathvanya sathi loop (Tumhi sankhya badlu shakta)
        const images = data.results.slice(0, 5);

        for (let imgUrl of images) {
            // Kahida results madhe profile images kiva khote links asatat, te skip karnyasathi
            if (imgUrl.includes("googleusercontent.com/profile")) continue;

            await conn.sendMessage(from, { 
                image: { url: imgUrl },
                caption: `*BILAL-MD IMAGE SEARCH:* ${q.toUpperCase()}`
            }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        reply("Error: Image API response fail zali.");
    }
});
