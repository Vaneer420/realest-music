require('dotenv').config();
const fs = require('fs');
const {Client, Collection, GatewayIntentBits, ActivityType} = require('discord.js');
const client = new Client({intents:[GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates]});
client.commands = new Collection();
client.aliases = new Collection();

module.exports = client; // this is probably a bad idea

var queue = {
	connection: null,
	songs: []
};

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
	if(command.alias != undefined) client.aliases.set(command.alias, command);
}

client.on("ready", async () => {
	console.log('Client user logged in: ' + client.user.tag);
	client.user.setPresence({ activities: [{ type: ActivityType.Streaming, name: 'music in RR! :D' }] });
	client.user.setStatus('idle');
});

client.on('messageCreate', message => {
	if(!message.content.startsWith('m!') || message.author.bot) return;
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
	}
});

client.on('error', error => {
	console.error(error);
});

client.login(process.env.token);