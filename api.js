const {EmbedBuilder} = require('discord.js');
var client = require('./index.js');

module.exports = {
	/**
	 * calculates the total playing time, so you don't have to repeat the same lines of code over and over again
	 * @param {string (but please send in a number)} duration usually from song.duration, but as long as its the "seconds for how long the song is" then we'd be good
	 * @returns **string** that you can just pass into .setDescription. this will not include the time. blockquotes (``) aren't included
	 * @author github/williamanimate
	 */
	calculateTotalSongLength(duration) {
		if(duration == undefined) return "some line of code forgot the duration lmao, enjoy this very sick end timestamp";

		// TODO: implement days, but youtube doesn't allow videos over 24 hours (citation needed), so probably not an issue?
		let hrs = Math.floor(duration / 3600) < 10 ? "0" + Math.floor(duration / 3600) : Math.floor(duration / 3600);
		let mins = Math.floor((duration - (hrs * 3600)) / 60) < 10 ? "0" + Math.floor((duration - (hrs * 3600)) / 60) : Math.floor((duration - (hrs * 3600)) / 60);
		let secs = duration - (hrs * 3600) - (mins * 60) < 10 ? "0" + (duration - (hrs * 3600) - (mins * 60)) : duration - (hrs * 3600) - (mins * 60);

		if(hrs == "00") {
			return `${mins}:${secs}`;
		} else {
			return `${hrs}:${mins}:${secs}`;
		}
	},

	/**
	 * returns an embed.
	 * @param {string} text customied footer text message
	 * @returns EmbedBuilder thingy
	 */
	prepareEmbedMessage(text = "https://github.com/Vaneer420/realest-music") {
		console.log("its working");
		let embed = new EmbedBuilder()
			.setColor('#18BCDC')
			.setThumbnail(client.user.avatarURL({size: 512}))
			.setFooter({
				text: text,
				iconURL: 'https://files.softicons.com/download/social-media-icons/flat-gradient-social-icons-by-guilherme-lima/png/512x512/Github.png'
			});

		return embed;
	}
};
