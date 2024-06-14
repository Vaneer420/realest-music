const api = require("../api.js");

module.exports = {
	name: 'remove',
	description: 'Removes a specified index from the queue, 0 being the current song playing and onwards.',
	usage: 'm!remove <#>',
	category: 'QUEUE MANAGEMENT',
	execute(message, args, client, queue) {
		var embed = api.prepareEmbedMessage(client);
		let isItPermissibleToRemoveItemsFromThisSpecificMusicQueueInTheCurrentExecutionContextBooleanVariable = true;

		if(isNaN(Number(args[0])) || !queue.songs.length) {
			embed.setTitle('Command Error');
			if(isNaN(Number(args[0]))) embed.setDescription('Please enter a valid index.');
			if(!queue.songs.length) embed.setDescription('The queue is currently empty.');
			return message.channel.send({ embeds: [embed] });
		}

		let indexToRemove = Number(args[0]) - 1;
		if(indexToRemove < 1) {
			embed = api.errorEmbed('You cannot remove indexes less than 2 from the queue!', embed);
			isItPermissibleToRemoveItemsFromThisSpecificMusicQueueInTheCurrentExecutionContextBooleanVariable = false;
		}

		if(isItPermissibleToRemoveItemsFromThisSpecificMusicQueueInTheCurrentExecutionContextBooleanVariable) {
			const removedSong = queue.songs.splice(indexToRemove, 1);

			if(removedSong.length) embed.setTitle('Song Removed').setDescription(`The song "${removedSong[0].title}" has been successfully removed from the queue.`);
			else embed = api.errorEmbed('No song was removed. The provided index might be invalid.', embed);
		}

		return message.channel.send({ embeds: [embed] });
	}
};