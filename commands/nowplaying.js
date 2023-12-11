const {EmbedBuilder} = require('discord.js');
const api = require("../api.js");

module.exports = {
	name: 'nowplaying',
	description: 'Shows what\'s currently playing and details about it.',
	usage: 'm!nowplaying',
	execute(message, args, client, queue) {
		const embed = new EmbedBuilder()
			.setTitle(`Now Playing`)
			.setColor('#18BCDC')
			.setThumbnail(client.user.avatarURL({size: 512}))
			.setFooter({
				text: 'https://github.com/Vaneer420/realest-music',
				iconURL: 'https://files.softicons.com/download/social-media-icons/flat-gradient-social-icons-by-guilherme-lima/png/512x512/Github.png'
			});

		if(queue.connection != null) {
			const player = queue.connection.state.subscription.player;
			embed.setDescription(`[${queue.songs[0].title}](${queue.songs[0].url})\n\`${`${String(Math.floor(player.state.playbackDuration / 1000 / 60)).padStart(2, '0')}:${String(Math.floor(player.state.playbackDuration / 1000 % 60)).padStart(2, '0')}`} - ${String(api.calculateTotalSongLength(queue.songs[0].duration))}\``);
		} else {
			embed.setTitle('Command Failed')
				.setDescription('The bot is not currently playing anything.');
		}

		return message.channel.send({embeds: [embed]});
	}
}