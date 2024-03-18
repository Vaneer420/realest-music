const {AudioPlayerStatus} = require('@discordjs/voice');
const api = require("../api.js");

module.exports = {
	name: 'resume',
	description: 'Resumes the current song, if paused.',
	usage: 'm!resume',
	execute(message, args, client, queue) {
		var embed = api.prepareEmbedMessage(client);

		if(queue.connection != null) {
			const player = queue.connection.state.subscription.player;
			if(player.state.status == AudioPlayerStatus.Paused)player.unpause();
			else embed = api.errorEmbed('The song is not paused.', embed);
		} else embed = api.errorEmbed('The bot is not currently connected to the voice channel.', embed);

		if(embed.data.description == undefined) embed.setDescription(`"${queue.songs[0].title}" has been resumed.`);
		return message.channel.send({embeds: [embed]});
	}
}