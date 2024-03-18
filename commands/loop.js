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

		if(mode != 'off' && mode != 'queue' && mode != 'song') return api.errorEmbed('Please provide a valid option!', embed, message);
		if(mode != 'off' && looping.enabled && typeof mode != 'undefined') return api.errorEmbed('Looping is already enabled. If you meant to turn it off, try `m!loop off`!', embed, message);

		if(mode == 'queue') {
			api.loopControl('set_enabled_true');
			api.loopControl('set_mode_queue')
			embed.setTitle('Looping Enabled').setDescription('Looping has been enabled for the queue.');
		}

		if(mode == 'song') {
			api.loopControl('set_enabled_true');
			api.loopControl('set_mode_song');
			embed.setTitle('Looping Enabled').setDescription('Looping has been enabled for this song.');
		}

		if(mode == 'off') {
			api.loopControl('set_enabled_false');
			embed.setTitle('Looping Disabled').setDescription('Looping has been disabled.');
		}

		return message.channel.send({embeds: [embed]});
	}
}