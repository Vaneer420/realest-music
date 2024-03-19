const api = require('../api.js');

module.exports = {
	name: 'loop',
	description: 'Allows you to toggle looping a specific song.',
	usage: 'm!loop <off, queue, song>',
	alias: 'l',
	execute(message, args, client, queue) {
		var looping = api.loopControl();
		var mode = args[0];
		const embed = api.prepareEmbedMessage(client);

        switch(mode) {
            case 'queue':
                api.loopControl('set_enabled_true');
                api.loopControl('set_mode_queue')
                embed.setTitle('Looping Enabled').setDescription('Looping has been enabled for the queue.');
                break;
            case 'song':
                api.loopControl('set_enabled_true');
                api.loopControl('set_mode_song');
                embed.setTitle('Looping Enabled').setDescription('Looping has been enabled for this song.');
                break;
            case 'off':
                api.loopControl('set_enabled_false');
                embed.setTitle('Looping Disabled').setDescription('Looping has been disabled.');
                break;
            default:
                return api.errorEmbed('Please provide a valid option!', embed, message);
        }

		return message.channel.send({embeds: [embed]});
	}
}

