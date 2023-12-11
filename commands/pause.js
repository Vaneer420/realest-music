const {AudioPlayerStatus} = require('@discordjs/voice');
const api = require("../api.js");

module.exports = {
	name: 'pause',
	description: 'Pauses the current song, if playing.',
	usage: 'm!pause',
	execute(message, args, client, queue) {
		const embed = api.prepareEmbedMessage(client);

		if(queue.connection != null) {
			const player = queue.connection.state.subscription.player;
			if(player.state.status == AudioPlayerStatus.Playing) {
				player.pause();
			} else {
				embed.setTitle('Command Failed')
					.setDescription('The song is not playing.');
			}
		} else {
			embed.setTitle('Command Failed')
				.setDescription('The bot is not currently connected to the voice channel.');
		}

		if(embed.data.description == undefined) embed.setDescription(`"${queue.songs[0].title}" has been paused.`);
		return message.channel.send({embeds: [embed]});
	}
}