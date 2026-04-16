hereconst config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "owner",
    alias: ["developer", "creator"],
    desc: "To get the bot's contact information.",
    category: "main",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // 1. Bot Number aur User Details
        const botNumber = conn.user.id.split(':')[0];
        
        // Priority: Profile Name > Config Name > Default Name
        const ownerName = conn.user.name || config.OWNER_NAME || "BILAL KING"; 

        const botVcard = `BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
ORG:BILAL-MD TECH;
TEL;type=CELL;type=VOICE;waid=${botNumber}:+${botNumber}
END:VCARD`;

        // 2. Contact Card bhejyein
        await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard: botVcard }]
            },
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: `OWNER: ${ownerName}`,
                    body: "MULTIDEVICE WHATSAPP BOT",
                    thumbnailUrl: "https://i.postimg.cc/7LWBgYMq/bilal.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in owner command:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
