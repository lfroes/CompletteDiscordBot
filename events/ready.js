module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Pronto, logado com ${client.user.tag}`);
	},
};