const {EmbedBuilder} = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Shows all the commands that can be used.',
	usage: 'm!help',
	execute(message, args, client) {
		const embed = new EmbedBuilder()
			.setColor('#18BCDC')
			.setThumbnail(client.user.avatarURL({size: 512}))
			.setFooter({
				text: 'Type "m!help <command name>" for more help on a specific command | https://github.com/Vaneer420/realest-music',
				iconURL: 'https://files.softicons.com/download/social-media-icons/flat-gradient-social-icons-by-guilherme-lima/png/512x512/Github.png'
			});

		if(args[0] != null) {
			const cmdupper = args[0].charAt(0).toUpperCase() + args[0].slice(1);
			const command = client.commands.get(args[0].toLowerCase());
			if(command == null) {
				embed.setTitle('Command Failed')
					.setDescription('Invalid command supplied.');
			} else {
				embed.setTitle(`${cmdupper} Command Details`)
					.setDescription(`${command.description}\n\nUsage: \`${command.usage}\``);
			}
		} else {
			embed.setTitle('Available Commands')
				.setDescription(client.commands.map(ele => `**${ele.name}**: ${ele.description}`).join('\n'));
		}

		message.channel.send({
			embeds: [embed]
		});
	}
}