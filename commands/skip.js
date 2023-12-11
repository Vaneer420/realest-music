const api = require("../api.js");

module.exports = {
	name: 'skip',
	description: 'Skips whatever\'s currently playing.',
	usage: 'm!skip',
	alias: 's',
	execute(message, args, client, queue) {
		const embed = api.prepareEmbedMessage(client);

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

		if(embed.data.description == undefined) embed.setDescription(`"${queue.songs[0].title}" was skipped successfully.`);
		return message.channel.send({embeds: [embed]});
	}
}