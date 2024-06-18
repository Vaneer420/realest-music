const {AudioPlayerStatus} = require('@discordjs/voice');
const {prepareEmbedMessage, errorEmbed} = require("../api.js");

module.exports = {
	name: 'resume',
	description: 'Resumes the current song, if paused.',
	usage: 'm!resume',
	category: 'PLAYBACK CONTROLS',
	execute(message, args, client, queue) {
		var embed = prepareEmbedMessage(client);

		if(queue.connection != null) {
			const player = queue.connection.state.subscription.player;
			if(player.state.status == AudioPlayerStatus.Paused)player.unpause();
			else embed = errorEmbed('The song is not paused.', embed);
		} else embed = errorEmbed('The bot is not currently connected to the voice channel.', embed);

		if(embed.data.description == undefined) embed.setDescription(`"${queue.songs[0].title}" has been resumed.`);
		return message.channel.send({embeds: [embed]});
	}
}