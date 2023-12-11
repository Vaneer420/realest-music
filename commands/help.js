const api = require("../api.js");

module.exports = {
	name: 'help',
	description: 'Shows all the commands that can be used.',
	usage: 'm!help',
	execute(message, args, client) {
		const embed = api.prepareEmbedMessage(client, 'Type "m!help <command name>" for more help on a specific command');

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