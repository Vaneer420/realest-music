const {prepareEmbedMessage, errorEmbed} = require("../api.js");

module.exports = {
	name: 'queue',
	description: 'Shows the current queue.',
	usage: 'm!queue',
	alias: "q",
	category: 'QUEUE MANAGEMENT',
	execute(message, args, client, queue) {
		const embed = prepareEmbedMessage(client);

		if(!queue.songs[0]) return errorEmbed('There are no songs in the queue', embed, message);

		embed.setTitle('Current Queue');
		queue.songs.forEach((song, index) => {
			embed.addFields({name: `#${index + 1} - ${song.title}`, value: `[${song.title}](${song.url})`});
		});

		return message.channel.send({embeds:[embed]});
	},
};