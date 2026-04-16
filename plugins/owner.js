const config = require('../config');
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
        const botNumber = conn.user.id.split(':')[0];
        const ownerName = config.OWNER_NAME || "BILAL-MD"; 

        const botVcard = `BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
ORG:BILAL-MD TECH;
TEL;type=CELL;type=VOICE;waid=${botNumber}:+${botNumber}
END:VCARD`;

        // Contact Card aur Image ke saath Button-like Link
        await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard: botVcard }]
            },
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: `🌟 OWNER: ${ownerName}`,
                    body: "Tap here to join our WhatsApp Channel 🚀",
                    thumbnailUrl: "https://i.postimg.cc/7LWBgYMq/bilal.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G", // Aapka Channel Link
                    mediaType: 1,
                    renderLargerThumbnail: true, // Is se image bari aur button jaisi dikhe gi
                    showAdAttribution: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in owner command:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
