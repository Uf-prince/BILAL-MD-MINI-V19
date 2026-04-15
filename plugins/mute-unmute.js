const { cmd } = require('../command');

// --- MUTE COMMAND ---
cmd({
    pattern: "mute",
    alias: ["lock", "closegc"],
    desc: "Mutes the group (Only admins can send messages)",
    category: "group",
    react: "🔒",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply, sender }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        if (!isAdmins) return reply("❌ Only group admins can use this command.");
        if (!isBotAdmins) return reply("❌ I need to be an admin to mute the group.");

        await conn.groupSettingUpdate(from, 'announcement');
        
        await conn.sendMessage(from, {
            text: `*✅ GROUP CLOSED BY ADMIN* \n\nNow only admins can send messages.`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "BILAL-MD GROUP MANAGER",
                    body: "GROUP STATUS: MUTED 🔒",
                    thumbnailUrl: "https://i.postimg.cc/7LWBgYMq/bilal.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("❌ Error while muting the group.");
    }
});

// --- UNMUTE COMMAND ---
cmd({
    pattern: "unmute",
    alias: ["unlock", "opengc"],
    desc: "Unmutes the group (All members can send messages)",
    category: "group",
    react: "🔓",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply, sender }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        if (!isAdmins) return reply("❌ Only group admins can use this command.");
        if (!isBotAdmins) return reply("❌ I need to be an admin to unmute the group.");

        await conn.groupSettingUpdate(from, 'not_announcement');

        await conn.sendMessage(from, {
            text: `*✅ GROUP OPENED BY ADMIN* \n\nNow everyone can send messages.`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "BILAL-MD GROUP MANAGER",
                    body: "GROUP STATUS: UNMUTED 🔓",
                    thumbnailUrl: "https://i.postimg.cc/7LWBgYMq/bilal.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("❌ Error while unmuting the group.");
    }
});

