require('dotenv').config();
const fs = require('fs');
const {Client, Collection, GatewayIntentBits, ActivityType, EmbedBuilder} = require('discord.js');
const { time } = require('console');
const client = new Client({intents:[GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates]});
client.commands = new Collection();
client.aliases = new Collection();

var queue = {
	connection: null,
	songs: []
};

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const api = require('./api.js');
const debounce_gaming = {};

for(const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
	if(command.alias != undefined) client.aliases.set(command.alias, command);
}

client.on("ready", async () => {
	console.log('Client user logged in: ' + client.user.tag);
	client.user.setPresence({ activities: [{ type: ActivityType.Streaming, name: process.env.activity }] });
	client.user.setStatus('idle');
});

client.on('messageCreate', message => {
	if(!message.content.startsWith('m!') || message.author.bot) return;

	var current_time = Math.floor(Date.now() / 1000);
	const time_before = debounce_gaming[message.author.id];
	if(time_before != null && current_time - time_before < 3) return api.errorEmbed(`You're on command cooldown, chill out. \`${3 - (current_time - time_before)}\` seconds remaining.`, api.prepareEmbedMessage(client), message);

	const args = message.content.trim().slice(2).split(' ');
	const commandName = args.shift().toLowerCase();
	var command;
	if(client.commands.get(commandName)) command = client.commands.get(commandName);
	if(client.aliases.get(commandName)) command = client.aliases.get(commandName);
	if(command == null) return;

	try {
		command.execute(message, args, client, queue);
	} catch (error) {
		console.error(error);
		message.reply(error);
	};

	debounce_gaming[message.author.id] = current_time;
});

client.on('error', error => {
	console.error(error);
});

client.login(process.env.token);