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
        // Quoted message check
        const quoted = m.quoted ? m.quoted : mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quoted) {
            return reply("*APKO KISI NE PRIVATE PHOTO VIDEO YA VOICE BHEJI HAI 😟 AUR AP USE BAR BAR DEKHNA CHAHTE HAI 😄 TO PEHLE US MSG KO MENTION KR LO 😍 AUR PHIR LIKHO* \n\n*❮VV❯*");
        }

        // View Once Message find karna
        const viewOnce = quoted.viewOnceMessageV2 || quoted.viewOnceMessage || quoted;
        const type = Object.keys(viewOnce.message || viewOnce)[0];
        const media = (viewOnce.message || viewOnce)[type];

        // Sirf Image ya Video ho
        if (!type.includes('imageMessage') && !type.includes('videoMessage')) {
            return reply("*DUBARA KOSHISH KARE 🤗 (Sirf Image ya Video mention karein)*");
        }

        // Reaction
        const reactionEmojis = ['🔥', '⚡', '🚀', '💥', '👁️'];
        const reactEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        await conn.sendMessage(from, { react: { text: reactEmoji, key: mek.key } });

        // Media Download karna
        const stream = await downloadContentFromMessage(media, type.includes('image') ? 'image' : 'video');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        // Message bhejna with Image/Link Branding
        await conn.sendMessage(from, {
            [type.includes('image') ? "image" : "video"]: buffer,
            caption: media.caption || '> *REVEALED BY BILAL-MD*',
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "BILAL-MD VIEW ONCE REVEALER",
                    body: "Tap to Join Official Channel",
                    thumbnailUrl: "https://i.postimg.cc/7LWBgYMq/bilal.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G",
                    mediaType: 1,
                    renderLargerThumbnail: false // Isay false rakha hai taake media clear nazar aaye
                }
            }
        }, { quoted: mek });

    } catch (err) {
        console.error("VV Command Error:", err);
        reply("❌ Failed to reveal view-once media. Shayad bot ke paas permissions nahi hain.");
    }
});
