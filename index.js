const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MEMBERS]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    setInterval(checkMemberDuration, 86400000); // Run the check once every 24 hours
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content === `${config.prefix}rolecheck` && message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
        console.log('Manual role check initiated by admin.');
        checkMemberDuration();
    }
});

async function checkMemberDuration() {
    const guild = client.guilds.cache.get(config.guildID);
    if (!guild) {
        console.error(`Guild with ID ${config.guildID} not found.`);
        return;
    }

    const oneYearRole = guild.roles.cache.get(config.oneYearRoleID);
    const fiveYearRole = guild.roles.cache.get(config.fiveYearRoleID);

    if (!oneYearRole) {
        console.error(`One year role with ID ${config.oneYearRoleID} not found.`);
    }
    if (!fiveYearRole) {
        console.error(`Five year role with ID ${config.fiveYearRoleID} not found.`);
    }
    if (!oneYearRole || !fiveYearRole) {
        return;
    }

    const now = Date.now();

    const members = await guild.members.fetch();

    members.forEach(member => {
        const duration = now - member.joinedAt;
        if (duration > config.fiveYearDuration && !member.roles.cache.has(config.fiveYearRoleID)) {
            member.roles.add(fiveYearRole);
            console.log(`Assigned ${fiveYearRole.name} to ${member.user.tag}.`);
        } else if (duration > config.oneYearDuration && !member.roles.cache.has(config.oneYearRoleID)) {
            member.roles.add(oneYearRole);
            console.log(`Assigned ${oneYearRole.name} to ${member.user.tag}.`);
        }
    });
}

client.login(config.token);
