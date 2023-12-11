module.exports = {
    name: 'eval',
	description: 'Evaluates the code given. For development only.',
	usage: 'm!eval',
    execute(message, args, client, queue) {
        if(message.author.id == '665679445662629898') {
            eval(message.content.slice(7, message.content.length));
        }
    }
}