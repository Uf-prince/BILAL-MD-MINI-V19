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

// Ping Command
cmd({
    pattern: "ping",
    alias: ["speed","pong"],
    use: '.ping',
    desc: "Check bot's response time.",
    category: "main",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const start = Date.now();

        const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥'];
        const textEmojis = ['💎', '🏆', '⚡️', '🚀', '✨', '🛡️'];

        let reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

        // Reaction send karein
        await conn.sendMessage(from, { react: { text: textEmoji, key: mek.key } });

        const end = Date.now();
        const responseTime = (end - start) / 1000;

        const text = `> *SPEED :❯ ${responseTime.toFixed(2)} MS*`;

        // Final Message with Image and Channel Link
        await conn.sendMessage(from, {
            text,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "BILAL-MD UPDATES",
                    body: "JOIN OUR OFFICIAL CHANNEL",
                    thumbnailUrl: "https://i.postimg.cc/7LWBgYMq/bilal.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: verifiedContact });

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});
