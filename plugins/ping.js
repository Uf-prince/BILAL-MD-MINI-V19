const config = require('../config');
const { cmd, commands } = require('../command');

// Popkids Verified Contact
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
FN:POP KIDS VERIFIED ✅
ORG:POP KIDS BOT;
TEL;type=CELL;type=VOICE;waid=923078071982:+923078071982
END:VCARD`

        }
    }
};

// ping command
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

        const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '🕐', ''];
        const textEmojis = ['💎', '🏆', '⚡️', '🚀', '🎶', '🌠', '🌀', '🔱', '🛡️', '✨'];

        let reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

        // Ensure reaction and text emojis are different
        while (textEmoji === reactionEmoji) {
            textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        }

        // Send reaction
        await conn.sendMessage(from, { react: { text: textEmoji, key: mek.key } });

        const end = Date.now();
        const responseTime = (end - start) / 1000;

        const text = `> *SPEED :❯ ${responseTime.toFixed(2)} MS*`;

        // Send ping message with verified contact quoted
        await conn.sendMessage(from, {
            text,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363289379419860@newsletter',
                    newsletterName: "Bilal Tech",
                    serverMessageId: 143
                }
            }
        }, { quoted: verifiedContact });

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`❌ An error occurred: ${e.message}`, verifiedContact);
    }
});

// ping2 command
cmd({
    pattern: "ping2",
    desc: "Check bot's response time.",
    category: "main",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const startTime = Date.now();
        const message = await conn.sendMessage(from, { text: '*Testing....😃*' }, { quoted: verifiedContact });
        const endTime = Date.now();
        const ping = endTime - startTime;

        await conn.sendMessage(from, { text: `*SPEED :❯ ${ping}*` }, { quoted: verifiedContact });
    } catch (e) {
        console.log(e);
        reply(`❌ ${e}`, verifiedContact);
    }
});
