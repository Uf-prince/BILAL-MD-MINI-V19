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
        // Bot ka number aur profile name extract karna
        const botNumber = conn.user.id.split(':')[0];
        const botName = conn.user.name || "BILAL-MD OWNER"; // WhatsApp profile wala name uthayega

        const botVcard = `BEGIN:VCARD
VERSION:3.0
FN:${botName}
ORG:BILAL TECH;
TEL;type=CELL;type=VOICE;waid=${botNumber}:+${botNumber}
END:VCARD`;

        // Contact Card aur Channel Link ke saath message bhejna
        await conn.sendMessage(from, {
            contacts: {
                displayName: botName,
                contacts: [{ vcard: botVcard }]
            },
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: `OWNER: ${botName}`,
                    body: "Click here to Join Official Channel",
                    thumbnailUrl: "https://i.postimg.cc/7LWBgYMq/bilal.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in owner command:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});
