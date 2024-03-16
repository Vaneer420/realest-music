const api = require("../api.js");

module.exports = {
	name: 'remove',
	description: 'Removes a specified index from the queue, 0 being the current song playing and onwards.',
	usage: 'm!remove <#>',
	execute(message, args, client, queue) {
		const embed = api.prepareEmbedMessage(client);

		if(Number(args[0]) == NaN) {
			embed.setTitle('Command Error')
				.setDescription('Please enter a valid index.');
		} else {
			if(!queue.songs.length > 0) {
				embed.setTitle('Command Error')
					.setDescription('The queue is currently empty.');

			} else {
				let index_to_remove = Number(args[0]) - 1;
				if(index_to_remove < 1) {
					embed.setTitle('Command Error')
						.setDescription('You cannot remove indexes less than 2 from the queue!');
				} else {
					const o = queue.songs.splice(index_to_remove, 1);

					if(o.length != 0) {
						embed.setTitle('Song Removed')
							.setDescription(`The song has been successfully removed from the queue.`);

					} else {
						embed.setTitle('Command Failed')
							.setDescription('No deleted items were returned. Did you provide the right index?');
					}
				}

				return message.channel.send({embeds: [embed]});
			}
		}
	}
}