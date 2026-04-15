const config = require('../config')
const { cmd, commands } = require('../command')
const { runtime } = require('../lib/functions')

cmd({
    pattern: "menu",
    alias: ["allmenu","fullmenu", "list", "m"],
    desc: "Show all bot commands",
    category: "menu",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {

        // Group commands by category
        let categories = {}
        commands.forEach(cmd => {
            if (!cmd.category) return
            if (!categories[cmd.category]) categories[cmd.category] = []
            categories[cmd.category].push(cmd.pattern)
        })

        // Header
        let menu = `*╭━━━👑 BILAL-MD 👑*
*║ 👑 USER :❯ ${config.OWNER_NAME}*
*║ 👑 PREFIX :❯ ❮  ${config.PREFIX}  ❯*
*║ 👑 PLATFORM :❯ bilal.arm64.x3hz*
*║ 👑 UPTIME :❯ ${runtime(process.uptime())}*
`

        // Build menu dynamically
        for (let category in categories) {
            menu += `*║ ╭━━══••══━━••⊷*
*║ 👑 ${category.toUpperCase()}*\n`

            categories[category].forEach(cmd => {
                menu += `*║ 👑 . ${config.PREFIX}${cmd}*\n`
            })

            menu += `*║ ╰━━══••══━━••⊷*
║
`
        }

        // Footer
        menu += `*╰════────═══════*
✦ ${config.DESCRIPTION || '👑 BILAL-MD WHATSAPP BOT 👑'}
`

        // Send as forwarded newsletter message
        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || 'https://i.postimg.cc/7LWBgYMq/bilal.jpg' },
            caption: menu,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    showAdAttribution: true,
                    title: `BILAL-MD MULTIDEVICE`,
                    body: config.DESCRIPTION || 'WHATSAPP BOT',
                    mediaType: 2,
                    mediaUrl: 'github.com/Bilaltech05',
                    thumbnail: { url: config.MENU_IMAGE_URL || 'https://i.postimg.cc/7LWBgYMq/bilal.jpg' },
                    sourceUrl: 'https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G'
                },
                mentionedJid: [m.sender]
            }
        }, { quoted: mek })

    } catch (e) {
        console.log(e)
    }
})
