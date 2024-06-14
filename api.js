const {EmbedBuilder, Message} = require('discord.js'); // used to require specific classes to the discord.js module
var looping = {enabled: false, mode: undefined}; // used in loopControl()
const debounceGaming = {}; // used in checkDebounce()

module.exports = {
	/**
	 * calculates the total playing time, so you don't have to repeat the same lines of code over and over again
	 * @param {string} duration **please send in a number** usually from song.duration, but as long as its the "seconds for how long the song is" then we'd be good
	 * @returns **string** that you can just pass into .setDescription. this will not include the time. blockquotes (``) aren't included
	 */
	calculateTotalSongLength(duration) {
		if(duration == undefined) console.error("duration not passed to calculateTotalSongLength. See stacktrace for details.");

		// TODO: implement days, but youtube doesn't allow videos over 24 hours (citation needed), so probably not an issue?
		let hrs = Math.floor(duration / 3600) < 10 ? "0" + Math.floor(duration / 3600) : Math.floor(duration / 3600);
		let mins = Math.floor((duration - (hrs * 3600)) / 60) < 10 ? "0" + Math.floor((duration - (hrs * 3600)) / 60) : Math.floor((duration - (hrs * 3600)) / 60);
		let secs = duration - (hrs * 3600) - (mins * 60) < 10 ? "0" + (duration - (hrs * 3600) - (mins * 60)) : duration - (hrs * 3600) - (mins * 60);

		if(hrs == "00") return `${mins}:${secs}`;
		else return `${hrs}:${mins}:${secs}`;
	},

	/**
	 * returns an embed.
	 * @param {string} client the variable thats being passed around. see index.js line 4.
	 * @param {string} text *optional* customized footer text message
	 * @returns EmbedBuilder thingy
	 */
	prepareEmbedMessage(client, text = undefined) {
		if(text == undefined) text = `https://github.com/Vaneer420/realest-music`;
		else text = `${text} | https://github.com/Vaneer420/realest-music`;

		return new EmbedBuilder()
			.setColor('#18BCDC')
			.setThumbnail(client.user.avatarURL({size: 512}))
			.setFooter({
				text: text,
				iconURL: 'https://files.softicons.com/download/social-media-icons/flat-gradient-social-icons-by-guilherme-lima/png/512x512/Github.png'
			});
	},

	/**
	 * loop control
	 * @param {string} option can be "set_false" or "set_true", or leave blank to return looping status without touching it
	 * @returns **boolean** - loop status
	 */
	loopControl(option = undefined) {
		if(typeof option == "undefined") return looping;

		if(option == "set_enabled_true") looping.enabled = true;
		if(option == "set_enabled_false") {looping.enabled = false; looping.mode = undefined}
		if(option == "set_mode_song") looping.mode = 'song';
		if(option == "set_mode_queue") looping.mode = 'queue';
	},

	/**
	 * makes a command error embed with specified message and optionally sends it in channel
	 * @param {string} error text to set as embed description; the error description
	 * @param {EmbedBuilder} embed original embed prepared for command output
	 * @param {Message} [message] the message parameter from the module parameter list, only include if you want error message sent after function call
	 */
	errorEmbed(error, embed, message=undefined) {
		embed.setTitle('Command Failed')
			.setDescription(error);

		if(typeof message != 'undefined') message.channel.send({embeds: [embed]});
		return embed;
	},

	/**
	 * checks debounce of user, assumes that when called they've sent a message
	 * @param {string} authorId id of user
	 * @returns object containing information on whether user should be rate limited and how many seconds are between their last command and command before that
	 */
	checkDebounce(authorId) {
        let returnValue = {
            shouldRateLimit: false,
            diff: 0,
        };

        const currentTime = Math.floor(Date.now() / 1000);
        const timeBefore = debounceGaming[authorId];
        let count = debounceGaming[`${authorId}_count`] || 0;
        const diff = currentTime - timeBefore;
        if(diff < process.env.debounce_minimal_timeout) {
            if(count > process.env.debounce_activation_threshold) {
                returnValue.diff = diff;
                returnValue.shouldRateLimit = true;
                return returnValue;
            }
        }
        debounceGaming[authorId] = currentTime;
        debounceGaming[`${authorId}_count`] = count + 1;
        return returnValue;
    }
};
