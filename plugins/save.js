const { cmd } = require("../command");

cmd({
  pattern: "save",
  alias: ["sendme", 'send'],
  react: '🤗',
  desc: "Forwards quoted message back to user",
  category: "utility",
  filename: __filename
}, async (client, message, match, { from }) => {
  try {
    if (!match.quoted) {
      return await client.sendMessage(from, {
        text: "*KISI BHI MSG KO PEHLE MENTION KARE 🤗 AUR PHIR LIKHE*\n\n*❮ SAVE ❯*\n\n*TO WO MSG APKE INBOX ME SAVE HO JAYE GA 😍*"
      }, { quoted: message });
    }

    const buffer = await match.quoted.download();
    const mtype = match.quoted.mtype;
    const options = { quoted: message };

    let messageContent = {};
    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "image/jpeg"
        };
        break;
      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "video/mp4"
        };
        break;
      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: match.quoted.ptt || false
        };
        break;
      default:
        return await client.sendMessage(from, {
          text: "*SIRF VIDEO AUDIO YA PHOTO KO MENTION KARO BAS 🤗*"
        }, { quoted: message });
    }

    await client.sendMessage(from, messageContent, options);
  } catch (error) {
    console.error("Forward Error:", error);
    await client.sendMessage(from, {
      text: "❌ Error forwarding message:\n" + error.message
    }, { quoted: message });
  }
});
