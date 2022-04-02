const { SlashCommandBuilder } = require("@discordjs/builders");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const getUserByName = async (userName) => {
  try {
    await client.connect();

    const db = client.db("cdd-base");
    const col = db.collection("users");

    const users = await col.find({ name: { $regex: userName } }).toArray();

    return users;
  } finally {
    await client.close();
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Encontra um colaborador pelo seu nome")
    .addStringOption((option) =>
      option
        .setName("nome_do_colaborador")
        .setDescription("Nome do colaborador")
    ),
  async execute(interaction) {
    const userName = interaction.options.getString("nome_do_colaborador");
    if (userName) {
      const usersFind = await getUserByName(userName);
      const embed = await createEmbed(embedContent);
      return await interaction.reply(
        "Em desenvolvimento, aguarde " +
          interaction.options.getString("nome_do_colaborador")
      );
    }
    return await interaction.reply(
      "Em desenvolvimento, aguarde sem parametros"
    );
  },
};
