const ytdl = require('ytdl-core');
const yts = require('yt-search');
const {createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus, NoSubscriberBehavior} = require('@discordjs/voice');
const {errorEmbed, loopControl, prepareEmbedMessage, calculateTotalSongLength, skipControl} = require("../api.js");

module.exports = {
	name: 'play',
	description: 'Plays a specified song. Currently only supports Youtube.',
	usage: 'm!play <youtube url or search query>',
	alias: "p",
	category: 'PLAYBACK CONTROLS',
	async execute(message, args, client, queue) {
		var embed = prepareEmbedMessage(client);
		const voiceChannel = message.member.voice.channel;
		if(!voiceChannel || voiceChannel.id !== process.env.vcid) return errorEmbed(`Please join <#${process.env.vcid}>.`, embed, message);

		var url = args[0];
		if(!url) return errorEmbed('Please provide a valid URL or search query.', embed, message);

		if(queue.songs.length >= 12) return errorEmbed('The maximum queue length is 12.', embed, message);

		if(!ytdl.validateURL(url)) {
			url = await yts({query: args.join(' ')});
			if(url.videos.length == 0) return errorEmbed('No search results found.', embed, message);
			else url = url.videos[0].url;
		}

		if(!queue.connection) {
			queue.connection = joinVoiceChannel({
				adapterCreator: message.guild.voiceAdapterCreator,
				channelId: process.env.vcid,
				guildId: process.env.guildid
			});

			queue.connection.on('stateChange', (a, state) => { // im fairly certain this and the next 4 lines is something that can be done in one but im too lazy to look for that. open a pr if you have a better way to handle this
				if(state.status == 'disconnected') {
					queue.connection.rejoin(); // if you gave the bot bad permissions, this is your fault. im not explaining anything more
				}
			});
		}

		const streaminfo = await ytdl.getInfo(url);
		const song = {
			title: streaminfo.videoDetails.title,
			url: streaminfo.videoDetails.video_url,
			duration: streaminfo.videoDetails.lengthSeconds
		};

		if(queue.songs.length !== 0) {
			queue.songs.push(song);
			embed.setTitle(`Queued: ${song.title}`)
				.setDescription(`[${song.title}](${song.url}) has been queued and will play soon! Check the queue with \`m!queue\` to see when.`);
		} else {
			try {
				const player = createAudioPlayer({behaviors: {noSubscriber: NoSubscriberBehavior.Pause}});
				player.on(AudioPlayerStatus.Idle, () => {
					let looping = loopControl();
					if(!looping.enabled) queue.songs.shift();
					else if(looping.mode == 'queue') {
						var song_just_played = queue.songs.shift();
						queue.songs.push(song_just_played);
					}

					playNextSong(player, queue, message.guild);
				});
				player.on('error', error => {
					console.log(error);
				});
				queue.songs.push(song);
				playNextSong(player, queue, message.guild);

				embed.setTitle(`Now Playing: ${song.title}`)
					.setDescription("\`0:00\` - " + `\`${calculateTotalSongLength(song.duration)}\``);
			} catch(error) {
				console.error(error);
				embed = errorEmbed('An error has occured.', embed);
			}
		}

		if(embed.data.title != null && embed.data.description != null) return message.channel.send({embeds:[embed]});
	},
};

async function playNextSong(player, queue, guild) {
	if(queue.songs.length > 0) {
		const song = queue.songs[0];
		const stream = ytdl(song.url, {filter: 'audioonly'});
		const resource = createAudioResource(stream);
		player.play(resource);
		queue.connection.subscribe(player);
		skipControl(guild.members.me.voice.channel.members.size, queue, 'clear');
	} else {
		queue.connection.destroy();
		queue['connection'] = null;
	}
}
