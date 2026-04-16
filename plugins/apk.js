const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "apk",
    alias: ["app", "getapp", "apkdl"],
    desc: "Download APK from PrinceTech",
    category: "download",
    react: "📦",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Bilal, App ka naam to likho! (e.g. .apk Car Game)");

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // PrinceTech APK Downloader API
        const apikey = "prince";
        const apiUrl = `https://api.princetechn.com/api/download/apkdl?apikey=${apikey}&appName=${encodeURIComponent(q)}`;
        
        const res = await axios.get(apiUrl);
        
        if (!res.data.success || !res.data.result) {
            return reply("❌ Bilal, ye app PrinceTech server par nahi mili.");
        }

        const app = res.data.result;
        
        // Step 1: Send App Info & Thumbnail
        const infoMsg = `*📦 BILAL-MD APK DOWNLOADER*\n\n` +
                        `*📱 Name:* ${app.appname}\n` +
                        `*👨‍💻 Dev:* ${app.developer || 'Unknown'}\n` +
                        `*📊 Size:* ${app.size || 'N/A'}\n\n` +
                        `> *Uploading APK file, please wait...*`;

        await conn.sendMessage(from, { 
            image: { url: app.appicon }, 
            caption: infoMsg 
        }, { quoted: mek });

        // Step 2: Send Direct APK File as Document
        await conn.sendMessage(from, {
            document: { url: app.download_url },
            mimetype: 'application/vnd.android.package-archive',
            fileName: `${app.appname}.apk`,
            caption: `*✅ ${app.appname} Downloaded Successfully*\n\n> *Powered by BILAL-MD*`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("APK DL Error:", e);
        reply("❌ Error: API response nahi de rahi ya file size bahut badi hai.");
    }
});
