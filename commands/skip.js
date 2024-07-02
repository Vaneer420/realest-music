const {prepareEmbedMessage, errorEmbed, skipControl} = require("../api.js");

module.exports = {
	name: 'skip',
	description: 'Skips whatever\'s currently playing.',
	usage: 'm!skip',
	alias: 's',
	category: 'PLAYBACK CONTROLS',
	execute(message, args, client, queue) {
		var embed = prepareEmbedMessage(client);

		if(!queue.connection) return errorEmbed('The bot is not currently playing anything!', embed, message);
		if(message.member.voice.channelId != process.env.vcid) return errorEmbed('You must join the voice channel to vote for a skip!', embed, message);

		const response = skipControl(message.guild.members.me.voice.channel.members.size, queue, undefined, message.author.id);
		if(response[0] == 'voted') embed.setTitle('Vote Submitted').setDescription(`You have voted to skip! \`${response[1]}/${response[2]}\``);
		if(response[0] == 'skipped') embed.setTitle('Skipped Successfully').setDescription('The current song has been successfully skipped!');
		if(response[0] == 'dup') embed = errorEmbed('You have already voted to skip!', embed);
		
		return message.channel.send({embeds: [embed]});
	}
}