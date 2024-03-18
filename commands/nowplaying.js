const api = require("../api.js");

module.exports = {
	name: 'nowplaying',
	description: 'Shows what\'s currently playing and details about it.',
	usage: 'm!nowplaying',
	alias: "np",
	execute(message, args, client, queue) {
		var embed = api.prepareEmbedMessage(client);

		if(queue.connection != null) {
			const player = queue.connection.state.subscription.player;
			embed.setDescription(`[${queue.songs[0].title}](${queue.songs[0].url})\n\`${`${String(Math.floor(player.state.playbackDuration / 1000 / 60)).padStart(2, '0')}:${String(Math.floor(player.state.playbackDuration / 1000 % 60)).padStart(2, '0')}`} - ${String(api.calculateTotalSongLength(queue.songs[0].duration))}\``);
		} else {
			embed = api.errorEmbed('The bot is not currently playing anything.', embed);
		}

		return message.channel.send({embeds: [embed]});
	}
}