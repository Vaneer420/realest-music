const {EmbedBuilder} = require('discord.js');

module.exports = {
	name: 'skip',
	description: 'Skips whatever\'s currently playing.',
	usage: 'm!skip',
	execute(message, args, client, queue) {
		const embed = new EmbedBuilder()
			.setTitle('Song Skipped')
			.setDescription(`"${queue.songs[0].title}" was skipped successfully.`)
			.setColor('#18BCDC')
			.setThumbnail(client.user.avatarURL({size: 512}))
			.setFooter({
				text: 'https://github.com/Vaneer420/realest-music',
				iconURL: 'https://files.softicons.com/download/social-media-icons/flat-gradient-social-icons-by-guilherme-lima/png/512x512/Github.png'
			});

		if(queue.connection != null) {
			if(message.member.voice.channelId == process.env.vcid) {
				queue.connection.state.subscription.player.stop();
			} else {
				embed.setTitle('Command Failed')
					.setDescription(`Please join <#${process.env.vcid}>.`);
			}
		} else {
			embed.setTitle('Command Failed')
				.setDescription('The bot is not connected to the voice channel.');
		}

		return message.channel.send({embeds: [embed]});
	}
}