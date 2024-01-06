const api = require("../api.js");

module.exports = {
    name: 'remove',
    description: 'Removes a specified index from the queue, 0 being the current song playing and onwards.',
    usage: 'm!remove <#>',
    execute(message, args, client, queue) {
        const embed = api.prepareEmbedMessage(client);
        const o = queue.songs.splice(Number(args[1]) + 1, 1);

        if(o != undefined) {
            embed.setTitle('Song Removed')
                .setDescription(`The song has been successfully removed from the queue.`);
        } else {
            embed.setTitle('Command Failed')
                .setDescription('No deleted items were returned. Did you provide the right index?');
        }

        return message.channel.send({embeds: [embed]});
    }
}