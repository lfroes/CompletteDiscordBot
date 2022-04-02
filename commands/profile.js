const { SlashCommandBuilder } = require("@discordjs/builders");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const { MessageEmbed } = require("discord.js");

const getUserByName = async (userName, isSingleTarget) => {
  try {
    await client.connect();

    const db = client.db("cdd-base");
    const col = db.collection("users");

    if (isSingleTarget) {
      console.log(userName);
      const user = await col.findOne({ name: { $regex: userName } });
      return user;
    } else {
      const users = await col.find({ name: { $regex: userName } }).toArray();
      return users;
    }
  } finally {
    await client.close();
  }
};

const createEmbed = async (embedContent) => {
  const baseEmbed = new MessageEmbed()
    .setColor("0x5a43a5")
    .setAuthor({
      name: `${embedContent.status === "Online" ? "🟢 Online" : " ⚫ Offline"}`,
    })
    .setTitle(embedContent.name)
    .setURL("https://www.completteweb.com/")
    .setDescription(
      embedContent.description
        ? embedContent.description
        : "Erro ao carregar descrição"
    )
    .addField("Empresa: ", embedContent.company, false)
    .setThumbnail(embedContent.avatar)
    .setTimestamp()
    .setFooter({ text: "Complette Web", iconURL: "https://imgur.com/4RIoMdu" });

  if (embedContent.projects) {
    let projectsString = "";
    embedContent.projects.map((project) => {
      return (projectsString += `\n${
        project ? project : "Projeto vazio no banco (Falar com Adm)"
      }`);
    });
    baseEmbed.addField(
      "Projetos: ",
      projectsString ? projectsString : "Erro",
      false
    );
  }

  if (embedContent.email) {
    baseEmbed.addField(
      "Email: ",
      embedContent.email ? embedContent.email : "Erro",
      false
    );
  }

  return baseEmbed;
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
      const usersFind = await getUserByName(userName, false);
      if (usersFind.length < 1) {
        interaction.reply("Nenhum usuário encontrado");
      } else {
        return usersFind.map(async (user) => {
          const userEmbed = await createEmbed(user);
          interaction.channel.send({ embeds: [userEmbed] });
        });
      }
    } else {
      const interactionUser = await interaction.guild.members.fetch(
        interaction.user.id
      );
      const discordUser = interactionUser.nickname;
      const userCDD = await getUserByName(discordUser, true);
      if (userCDD == null ) {
        return await interaction.reply("Colaborador não encontrado, para criar um perfil, use o comando `/profile create`");
      } else {
        const userEmbed = await createEmbed(userCDD);
        return interaction.channel.send({ embeds: [userEmbed] });
      }
    }
  },
};
