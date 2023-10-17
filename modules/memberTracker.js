const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
    checkMemberDuration: async (guild) => {
        const now = Date.now();

        for (let member of guild.members.cache.values()) {
            if (member.user.bot) continue; // Skip bots
            
            const joinTimestamp = member.joinedTimestamp;
            const difference = now - joinTimestamp;
            const years = Math.floor(difference / (365.25 * 24 * 60 * 60 * 1000));

            if (years >= 5 && !member.roles.cache.has(config.fiveYearRoleID)) {
                await member.roles.add(config.fiveYearRoleID).catch(console.error);
            } else if (years >= 1 && !member.roles.cache.has(config.oneYearRoleID)) {
                await member.roles.add(config.oneYearRoleID).catch(console.error);
            }
        }
    }
};
