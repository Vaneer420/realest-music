const api = require("../api.js");

module.exports = {
	name: 'aliases',
	description: 'Shows all the aliases that can be used.',
	usage: 'm!aliases',
	category: 'GENERAL',
	execute(message, args, client) {
		const embed = api.prepareEmbedMessage(client);

		embed.setTitle('Aliases List')
			.setDescription(client.aliases.map(ele => `**m!${ele.alias}**: m!${ele.name}`).join('\n'));

		message.channel.send({embeds:[embed]});
	}
}