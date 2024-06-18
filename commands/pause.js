const {AudioPlayerStatus} = require('@discordjs/voice');
const {prepareEmbedMessage, errorEmbed} = require("../api.js");

module.exports = {
	name: 'pause',
	description: 'Pauses the current song, if playing.',
	usage: 'm!pause',
	category: 'PLAYBACK CONTROLS',
	execute(message, args, client, queue) {
		var embed = prepareEmbedMessage(client);

		if(queue.connection != null) {
			const player = queue.connection.state.subscription.player;
			if(player.state.status == AudioPlayerStatus.Playing) player.pause();
			else embed = errorEmbed('The song is not playing.', embed);
		} else embed = errorEmbed('The bot is not currently connected to the voice channel.', embed);

		if(embed.data.description == undefined) embed.setDescription(`"${queue.songs[0].title}" has been paused.`);
		return message.channel.send({embeds: [embed]});
	}
}