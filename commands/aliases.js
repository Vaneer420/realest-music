const {EmbedBuilder} = require('discord.js');

module.exports = {
	name: 'aliases',
	description: 'Shows all the aliases that can be used.',
	usage: 'm!aliases',
	execute(message, args, client) {
		const embed = new EmbedBuilder()
			.setColor('#18BCDC')
			.setThumbnail(client.user.avatarURL({size: 512}))
			.setFooter({
				text: 'https://github.com/Vaneer420/realest-music',
				iconURL: 'https://files.softicons.com/download/social-media-icons/flat-gradient-social-icons-by-guilherme-lima/png/512x512/Github.png'
			});

        embed.setTitle('Aliases List')
			.setDescription(client.aliases.map(ele => `**m!${ele.alias}**: m!${ele.name}`).join('\n'));

		message.channel.send({embeds:[embed]});
	}
}