const {loopControl, prepareEmbedMessage, errorEmbed, Enums} = require('../api.js');

const LoopStatus = Enums.LoopStatus;
const LoopMode = Enums.LoopMode;

module.exports = {
	name: 'loop',
	description: 'Allows you to toggle looping a specific song.',
	usage: 'm!loop <off, queue, song>',
	alias: 'l',
	category: 'PLAYBACK CONTROLS',
	execute(message, args, client, queue) {
		const embed = prepareEmbedMessage(client);
		
		if(!queue.connection) return errorEmbed(`The bot is not currently playing anything!`, embed, message);
		if(message.member.voice.channelId != process.env.vcid) return errorEmbed(`Please join <#${process.env.vcid}>.`, embed, message);

		var looping = loopControl();
		var mode = args[0];

		switch(mode) {
			case 'queue':
				loopControl(LoopStatus.Enabled);
				loopControl(LoopMode.Queue);
				embed.setTitle('Looping Enabled').setDescription('Looping has been enabled for the queue.');
				break;
			case 'song':
				loopControl(LoopStatus.Enabled);
				loopControl(LoopMode.Song);
				embed.setTitle('Looping Enabled').setDescription('Looping has been enabled for this song.');
				break;
			case 'off':
				loopControl(LoopStatus.Disabled);
				embed.setTitle('Looping Disabled').setDescription('Looping has been disabled.');
				break;
			default:
				return errorEmbed('Please provide a valid option!', embed, message);
		}

		return message.channel.send({embeds: [embed]});
	}
}