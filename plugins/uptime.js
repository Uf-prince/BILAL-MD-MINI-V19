const config = require('../config');
const { cmd, commands } = require('../command');

// Verified Contact Card
const verifiedContact = {
    key: {
        fromMe: false,
        participant: `0@s.whatsapp.net`,
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "BILAL-MD",
            Vcard: `BEGIN:VCARD
VERSION:3.0
FN:AI VERIFIED ✅
ORG:WHATSAPP BOT;
TEL;type=CELL;type=VOICE;waid=923078071982:+923078071982
END:VCARD`
        }
    }
};

// Uptime Command logic
cmd({
    pattern: "uptime",
    alias: ["runtime", "alive"],
    desc: "Check how long the bot has been running.",
    category: "main",
    react: "⏳",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // Uptime calculation
        const uptimeSeconds = process.uptime();
        const days = Math.floor(uptimeSeconds / (24 * 3600));
        const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeSeconds % 60);

        const runtimeText = `> *UPTIME :❯ ${days}D ${hours}H ${minutes}M ${seconds}S*`;

        // Send uptime message with Image and Channel Link
        await conn.sendMessage(from, {
            text: runtimeText,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "BILAL-MD UPTIME STATUS",
                    body: "BOT IS RUNNING SMOOTHLY",
                    thumbnailUrl: "https://i.postimg.cc/7LWBgYMq/bilal.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: verifiedContact });

    } catch (e) {
        console.error("Error in uptime command:", e);
        reply(`❌ An error occurred: ${e.message}`, verifiedContact);
    }
});
