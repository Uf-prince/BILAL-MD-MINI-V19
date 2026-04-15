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
        
        if (!res.data.success || !res.data.result) {
            return reply("❌ Sorry Bilal, ye app nahi mil saki.");
        }

        const { appname, appicon, developer, download_url, mimetype } = res.data.result;

        // 1. Pehle App ki details aur Icon bhejein
        const desc = `*📦 BILAL-MD APK DOWNLOADER*\n\n` +
                     `*📱 Name:* ${appname}\n` +
                     `*👨‍💻 Dev:* ${developer}\n\n` +
                     `> *Uploading APK file, please wait...*`;

        await conn.sendMessage(from, { 
            image: { url: appicon }, 
            caption: desc 
        }, { quoted: mek });

        // 2. Direct APK File send karein as Document
        // Hum axios use kar rahe hain taake download confirm ho
        await conn.sendMessage(from, {
            document: { url: download_url },
            mimetype: 'application/vnd.android.package-archive',
            fileName: `${appname}.apk`,
            caption: `*✅ ${appname} Ready to Install*\n\n> *Downloaded by BILAL-MD*`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("APK Download Error:", e);
        reply("❌ Masla aa gaya! Shayad app ki file size bohot bari hai (100MB+).");
    }
});
