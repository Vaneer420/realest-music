const ytdl = require('ytdl-core');
const yts = require('yt-search');
const {createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus} = require('@discordjs/voice');
const {EmbedBuilder} = require('discord.js');
const api = require("../api.js");

module.exports = {
	name: 'play',
	description: 'Plays a specified song. Currently only supports Youtube.',
	usage: 'm!play <youtube url or search query>',
	async execute(message, args, client, queue) {
		const embed = new EmbedBuilder()
			.setColor('#18BCDC')
			.setThumbnail(client.user.avatarURL({size: 512}))
			.setFooter({
				text: 'https://github.com/Vaneer420/realest-music',
				iconURL: 'https://files.softicons.com/download/social-media-icons/flat-gradient-social-icons-by-guilherme-lima/png/512x512/Github.png'
			});

		const voiceChannel = message.member.voice.channel;
		if(!voiceChannel || voiceChannel.id !== process.env.vcid) {
			embed.setTitle('Command Failed')
				.setDescription(`Please join <#${process.env.vcid}>.`);
			return message.channel.send({embeds:[embed]});
		}

		if(!queue.connection) {
			queue.connection = joinVoiceChannel({
				adapterCreator: message.guild.voiceAdapterCreator,
				channelId: process.env.vcid,
				guildId: process.env.guildid
			});
		}

		var url = args[0];
		if(!url) {
			embed.setTitle('Command Failed')
				.setDescription('Please provide a valid URL or search query.');
			return message.channel.send({ embeds: [embed] });
		}

		if(!ytdl.validateURL(url)) {
			url = await yts({query: message.content.slice(7)});
			if(url.videos.length == 0) {
				embed.setTitle('Command Failed')
					.setDescription(`No search results found.`);
				return message.channel.send({embeds:[embed]});
			} else {
				url = url.videos[0].url;
			}
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
				const player = createAudioPlayer();
				player.on(AudioPlayerStatus.Idle, () => {
					queue.songs.shift();
					if(queue.songs.length > 1) {
						embed.setTitle(`not implemented`)
					}
					playNextSong(player, queue);
				});
				player.on('error', error => {
					console.log(error);
				});
				queue.songs.push(song);
				playNextSong(player, queue);

				embed.setTitle(`Now Playing: ${song.title}`)
					.setDescription("\`0:00\` - " + `\`${api.calculateTotalSongLength(song.duration)}\``);
			} catch(error) {
				console.error(error);
				embed.setTitle('Command Failed')
					.setDescription('An error has occurred.');
			}
		}

		if(embed.data.title != null && embed.data.description != null) return message.channel.send({embeds:[embed]});
	},
};

async function playNextSong(player, queue) {
	if(queue.songs.length > 0) {
		const song = queue.songs[0];
		const stream = ytdl(song.url, {filter: 'audioonly'});
		const resource = createAudioResource(stream);
		player.play(resource);
		queue.connection.subscribe(player);
	} else {
		queue.connection.destroy();
		queue['connection'] = null;
	}
}
