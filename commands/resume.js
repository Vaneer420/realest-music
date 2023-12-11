const {AudioPlayerStatus} = require('@discordjs/voice');
const api = require("../api.js");

module.exports = {
	name: 'resume',
	description: 'Resumes the current song, if paused.',
	usage: 'm!resume',
	execute(message, args, client, queue) {
		const embed = api.prepareEmbedMessage(client);

		if(queue.connection != null) {
			const player = queue.connection.state.subscription.player;
			if(player.state.status == AudioPlayerStatus.Paused) {
				player.unpause();
			} else {
				embed.setTitle('Command Failed')
					.setDescription('The song is not paused.');
			}
		} else {
			embed.setTitle('Command Failed')
				.setDescription('The bot is not currently connected to the voice channel.');
		}

		if(embed.data.description == undefined) embed.setDescription(`"${queue.songs[0].title}" has been resumed.`);
		return message.channel.send({embeds: [embed]});
	}
}