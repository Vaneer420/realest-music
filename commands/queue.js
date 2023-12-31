const api = require("../api.js");

module.exports = {
	name: 'queue',
	description: 'Shows the current queue.',
	usage: 'm!queue',
	alias: "q",
	execute(message, args, client, queue) {
		const embed = api.prepareEmbedMessage(client);

		if(!queue.songs[0]) {
	 		embed.setTitle('Queue is Empty')
				.setDescription('There are no songs in the queue.');
			return message.channel.send({embeds:[embed]});
		}

		embed.setTitle('Current Queue');
		queue.songs.forEach((song, index) => {
			embed.addFields({name: `#${index + 1} - ${song.title}`, value: `[${song.title}](${song.url})`});
		});

		return message.channel.send({embeds:[embed]});
	},
};