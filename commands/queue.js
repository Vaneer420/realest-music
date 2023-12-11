const {EmbedBuilder} = require('discord.js');

module.exports = {
	name: 'queue',
	description: 'Shows the current queue.',
	usage: 'm!queue',
	alias: "q",
	execute(message, args, client, queue) {
		const embed = new EmbedBuilder()
			.setColor('#18BCDC')
			.setThumbnail(client.user.avatarURL({size: 512}))
			.setFooter({
				text: 'https://github.com/Vaneer420/realest-music',
				iconURL: 'https://files.softicons.com/download/social-media-icons/flat-gradient-social-icons-by-guilherme-lima/png/512x512/Github.png'
			});

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