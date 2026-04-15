const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "apk",
    alias: ["app", "getapp"],
    desc: "Download Android Apps (APK)",
    category: "download",
    react: "📦",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Bilal, App ka naam to likho! (e.g. .apk WhatsApp)");

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // PrinceTech APK API Call
        const apiUrl = `https://api.princetech.my.id/api/download/apk?query=${encodeURIComponent(q)}`; 
        const res = await axios.get(apiUrl);
        
        if (!res.data.success) return reply("❌ Sorry, ye app nahi mil saki.");

        const { appname, appicon, developer, download_url, mimetype } = res.data.result;

        // 1. Pehle App ki details bhejein
        const desc = `*📦 APK DOWNLOADER*\n\n` +
                     `*📱 Name:* ${appname}\n` +
                     `*👨‍💻 Dev:* ${developer}\n\n` +
                     `> *Uploading file, please wait...*`;

        await conn.sendMessage(from, { 
            image: { url: appicon }, 
            caption: desc 
        }, { quoted: mek });

        // 2. Direct File send karein as Document
        await conn.sendMessage(from, {
            document: { url: download_url },
            mimetype: mimetype,
            fileName: `${appname}.apk`,
            caption: `> *Downloaded by BILAL-MD*`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        reply("❌ Error: File bohot bari hai ya server response nahi de raha.");
    }
});

