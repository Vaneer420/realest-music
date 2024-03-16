const api = require("../api.js");

module.exports = {
  name: 'remove',
  description: 'Removes a specified index from the queue, 0 being the current song playing and onwards.',
  usage: 'm!remove <#>',
  execute(message, args, client, queue) {
    const embed = api.prepareEmbedMessage(client);

    if (isNaN(Number(args[0])) || !queue.songs.length) {
      embed.setTitle('Command Error');
      if (isNaN(Number(args[0]))) {
        embed.setDescription('Please enter a valid index.');
      } else {
        embed.setDescription('The queue is currently empty.');
      }
      return message.channel.send({ embeds: [embed] });
    }

    let indexToRemove = Number(args[0]) - 1;
    if (indexToRemove < 0) {
      indexToRemove = 0;
    }

    const removedSong = queue.songs.splice(indexToRemove, 1);
    if (removedSong.length) {
      embed.setTitle('Song Removed')
          .setDescription(`The song "${removedSong[0].title}" has been successfully removed from the queue.`);
    } else {
      embed.setTitle('Command Failed')
          .setDescription('No song was removed. The provided index might be invalid.');
    }

    return message.channel.send({ embeds: [embed] });
  }
};

