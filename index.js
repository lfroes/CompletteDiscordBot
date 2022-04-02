const fs = require("node:fs");
const { Client, Collection, Intents } = require("discord.js");
require("dotenv/config");
const logger = require("pino")({
  transport: {
    target: "pino-pretty",
  },
});
const axios = require("axios");

const token = process.env.BOT_TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Collection();

const commandsFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandsFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}



const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Deu ruim', ephemeral: true });
	}
});

client.login(token);
