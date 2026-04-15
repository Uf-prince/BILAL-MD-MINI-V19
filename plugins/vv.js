const { cmd } = require('../command');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

cmd({
    pattern: "vv",
    alias: ["viewonce", "reveal"],
    desc: "Reveal view-once image or video",
    category: "tools",
    react: "👁️",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const quoted =
            mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted) {
            return reply("*APKO KISI NE PRIVATE PHOTO VIDEO YA VOICE BHEJI HAI 😟 AUR AP USE BAR BAR DEKHNA CHAHTE HAI 😄 TO PEHLE US MSG KO MENTION KR LO 😍 AUR PHIT LIKHO* \n\n*❮VV❯*");
        }

        // Handle view-once wrapper (Baileys v6+)
        const viewOnceMsg =
            quoted.viewOnceMessageV2 ||
            quoted.viewOnceMessage ||
            null;

        const mediaMessage =
            viewOnceMsg?.message?.imageMessage ||
            viewOnceMsg?.message?.videoMessage ||
            quoted.imageMessage ||
            quoted.videoMessage;

        if (!mediaMessage) {
            return reply("*DUBARA KOSHISH KARE 🤗*");
        }

        const isImage = !!mediaMessage.imageMessage || mediaMessage.mimetype?.startsWith("image");
        const isVideo = !!mediaMessage.videoMessage || mediaMessage.mimetype?.startsWith("video");

        if (!mediaMessage.viewOnce) {
            return reply("*YEH PRIVATE MSG NAHI HAI 🙄*");
        }

        // Ping-style reaction
        const reactionEmojis = ['🔥','⚡','🚀','💨','🎯','🎉','🌟','💥','👁️'];
        const reactEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];

        await conn.sendMessage(from, {
            react: { text: reactEmoji, key: mek.key }
        });

        // Download media
        const stream = await downloadContentFromMessage(
            mediaMessage,
            isImage ? "image" : "video"
        );

        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        // Send revealed media (NOT view-once)
        await conn.sendMessage(from, {
            [isImage ? "image" : "video"]: buffer,
            caption: mediaMessage.caption || '',
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363289379419860@newsletter",
                    newsletterName: "BILAL MD",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (err) {
        console.error("VV Command Error:", err);
        reply("❌ Failed to reveal view-once media.");
    }
});
