const api = require('../api.js');

const LoopStatus = {
    Enabled: "set_enabled_true",
    Disabled: "set_enabled_false",
}

const LoopMode = {
    Queue: "set_mode_queue",
    Song: "set_mode_song",
}

module.exports = {
	name: 'loop',
	description: 'Allows you to toggle looping a specific song.',
	usage: 'm!loop <off, queue, song>',
	alias: 'l',
	execute(message, args, client) {
		var looping = api.loopControl();
		var mode = args[0];
		const embed = api.prepareEmbedMessage(client);

        switch(mode) {
            case 'queue':
                api.loopControl(LoopStatus.Enabled);
                api.loopControl(LoopMode.Queue);
                embed.setTitle('Looping Enabled').setDescription('Looping has been enabled for the queue.');
                break;
            case 'song':
                api.loopControl(LoopStatus.Enabled);
                api.loopControl(LoopMode.Song);
                embed.setTitle('Looping Enabled').setDescription('Looping has been enabled for this song.');
                break;
            case 'off':
                api.loopControl(LoopStatus.Disabled);
                embed.setTitle('Looping Disabled').setDescription('Looping has been disabled.');
                break;
            default:
                return api.errorEmbed('Please provide a valid option!', embed, message);
        }

		return message.channel.send({embeds: [embed]});
	}
}

