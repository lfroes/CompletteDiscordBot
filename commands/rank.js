const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
const { MessageEmbed } = require('discord.js');


const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://cpt-admin:leecf222@cdd-base.vu0b0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri);

const getLastRank = async () => {
  try {
    await client.connect();

    const db = client.db("cdd-base");
    const col = db.collection("bestof");

    const lastRank = await col
      .findOne({}, { sort: { _id: -1 }, limit: 1 })

    return lastRank;
  } finally {
    await client.close();
  }
};

const handleBests = async (bests) => {
  if (bests.length < 1) {
    return 
  }
}

const createEmbed = async (embedContent) => {
  const { Title, Description, BestFinances } = embedContent
  // await handleBests(BestFinances)
  return embed  = {
    "type": "rich",
    "title": "🎖 " + Title,
    "description": Description,
    "color": 0x5A43A5,
    "fields": [
      {
        "name": `Financeiro`,
        "value": `1 2 3 `
      }
    ]
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Retorna os melhores do mês"),
  async execute(interaction) {
    const embedContent= await getLastRank();
    const embed = await createEmbed(embedContent)
    await interaction.reply({ embeds: [ embed ] });
  },
};
