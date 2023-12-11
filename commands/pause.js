const {EmbedBuilder} = require('discord.js');
const {AudioPlayerStatus} = require('@discordjs/voice');

module.exports = {
	name: 'pause',
	description: 'Pauses the current song, if playing.',
	usage: 'm!pause',
	execute(message, args, client, queue) {
		const embed = new EmbedBuilder()
			.setTitle(`Song Paused`)
			.setDescription(`"${queue.songs[0].title}" has been paused.`)
			.setColor('#18BCDC')
			.setThumbnail(client.user.avatarURL({size: 512}))
			.setFooter({
				text: 'https://github.com/Vaneer420/realest-music',
				iconURL: 'https://files.softicons.com/download/social-media-icons/flat-gradient-social-icons-by-guilherme-lima/png/512x512/Github.png'
			});

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

		return message.channel.send({embeds: [embed]});
	}
}