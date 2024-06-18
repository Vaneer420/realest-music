const {prepareEmbedMessage, errorEmbed} = require("../api.js");

module.exports = {
	name: 'help',
	description: 'Shows all the commands that can be used.',
	usage: 'm!help',
	category: 'GENERAL',
	execute(message, args, client) {
		const embed = prepareEmbedMessage(client, 'Type "m!help <command name>" for more help on a specific command');

		if(args[0] != null) {
			const cmdupper = args[0].charAt(0).toUpperCase() + args[0].slice(1);
			const command = client.commands.get(args[0].toLowerCase());
			if(command == null) return errorEmbed("Invalid command supplied.", embed, message);

			embed.setTitle(`${cmdupper} Command Details`)
				.setDescription(`${command.description}\n\nUsage: \`${command.usage}\``);
		} else {
			let commands = client.commands.map(ele => `**${ele.name}**: ${ele.description}`);
			embed.setTitle('**Available Commands**');

			// never knew about reduce until now, epic usage
			embed.addFields({
				name: 'GENERAL',
				value: client.commands.reduce((acc, com) => {
					if(com.category == 'GENERAL') acc.push(`${`__*${com.name}*__: ${com.description}`}`);
					return acc;
				}, []).join('\n')
			}, {
				name: 'PLAYBACK CONTROLS',
				value: client.commands.reduce((acc, com) => {
					if(com.category == 'PLAYBACK CONTROLS') acc.push(`${`__*${com.name}*__: ${com.description}`}`);
					return acc;
				}, []).join('\n')
			}, {
				name: 'QUEUE MANAGEMENT',
				value: client.commands.reduce((acc, com) => {
					if(com.category == 'QUEUE MANAGEMENT') acc.push(`${`__*${com.name}*__: ${com.description}`}`);
					return acc;
				}, []).join('\n')
			});

			// embed.setTitle('Available Commands')
			// 	.setDescription(client.commands.map(ele => `**${ele.name}**: ${ele.description}`).join('\n'));
		}

		message.channel.send({embeds: [embed]});
	}
}