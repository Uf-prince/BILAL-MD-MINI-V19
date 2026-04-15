const config = require('../config');
const { cmd, commands } = require('../command');

// Owner Command logic (Sends the BOT'S OWN contact)
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
        // Extracting Bot's own number
        const botNumber = conn.user.id.split(':')[0]; // Gets the number before the ':'
        const botName = "BILAL-MD OWNER"; // Aap yahan apna naam bhi likh sakte hain

        const botVcard = `BEGIN:VCARD
VERSION:3.0
FN:${botName}
ORG:BILAL TECH;
TEL;type=CELL;type=VOICE;waid=${botNumber}:+${botNumber}
END:VCARD`;

        // Send the Contact Card of the Bot Number
        await conn.sendMessage(from, {
            contacts: {
                displayName: botName,
                contacts: [{ vcard: botVcard }]
            },
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363289379419860@newsletter',
                    newsletterName: "Bilal Tech",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in owner command:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});

