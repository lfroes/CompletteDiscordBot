const { SlashCommandBuilder } = require("@discordjs/builders");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");


const deleteUser = async (user) => {
  try {
    await client.connect();

    const db = client.db("cdd-base");
    const col = db.collection("users");

    await col.deleteOne({ name: user.name });
    return "Usuário deletado com sucesso";
  } finally {
    await client.close();
  }
}


const createUser = async (user) => {
  try {
    await client.connect();

    const db = client.db("cdd-base");
    const col = db.collection("users");

    const userExists = await col.findOne({ name: user.name });

    if (userExists) {
      return "Usuário já existe";
    } else {
      await col.insertOne(user);
      return "Usuário criado com sucesso";
    }
  } finally {
    await client.close();
  }
};

const getUserByName = async (userName, isSingleTarget) => {
  try {
    await client.connect();

    const db = client.db("cdd-base");
    const col = db.collection("users");

    if (isSingleTarget) {
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
    .setThumbnail(
      embedContent.avatar != "skip"
        ? embedContent.avatar
        : "https://imgur.com/4RIoMdu.png"
    )
    .setTimestamp()
    .setFooter({
      text: "Complette Web",
      iconURL: "https://imgur.com/4RIoMdu.png",
    });

  if (embedContent.projects.length > 0) {
    let projectsString = "";
    embedContent.projects.map((project) => {
      return (projectsString += `${
        project ? `${project} ` : "Projeto vazio no banco (Falar com Adm)"
      }`);
    });
    baseEmbed.addField(
      "Projetos: ",
      projectsString ? projectsString : "Erro",
      false
    );
  }

  if (embedContent.Squad) {
    baseEmbed.addField("Squad: ", embedContent.Squad, false);
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
    .addSubcommand((subcommand) =>
      subcommand
        .setName("get")
        .setDescription("Encontra um colaborador pelo seu nome")
        .addStringOption((option) =>
          option
            .setName("nome_do_colaborador")
            .setDescription("Nome do colaborador")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Deleta um colaborador pelo seu nome")
        .addStringOption((option) =>
          option
            .setName("nome_do_colaborador")
            .setDescription("Nome do colaborador")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("create").setDescription("Cria um novo usuario no CDD")
    ),
  async execute(interaction) {
    if (interaction.options._subcommand === "get") {
      const userName = interaction.options.getString("nome_do_colaborador");
      if (userName) {
        const usersFind = await getUserByName(userName, false);
        if (usersFind.length < 1) {
          return await interaction.reply("Nenhum usuário encontrado");
        } else {
          for (const user of usersFind) {
            const embed = await createEmbed(user);
            await interaction.channel.send({ embeds: [embed] });
          }
          await interaction.reply("Segue aqui os resultados");
        }
      }
      if (interaction.options._hoistedOptions.length === 0) {
        const interactionUser = await interaction.guild.members.fetch(
          interaction.user.id
        );
        const discordUser = interactionUser.nickname;
        const userCDD = await getUserByName(discordUser, true);
        if (userCDD == null) {
          await interaction.reply(
            "Colaborador não encontrado, para criar um perfil, use o comando `/profile create`"
          );
        } else {
          const userEmbed = await createEmbed(userCDD);
          return interaction.reply({ embeds: [userEmbed] });
        }
      }
    }

    if (interaction.options._subcommand === "create") {
      let invokedChannel = interaction.channel;
      interaction.reply("Vamo criar um novo usuario então? Bora");
      const interactionUser = await interaction.guild.members.cache.get(
        interaction.user.id
      );
      const roles = interactionUser._roles;
      const userIsAdmin = roles.find((role) => role === "847465165725106207");

      if (!userIsAdmin) {
        return interaction.reply(
          "Você precisa ser administrador para poder executar esse comando"
        );
      }

      const filter = (m) => m.author.id === interaction.user.id;
      const DM = await interaction.member.send({
        content:
          "```Vamos Começar? Insira o nome do novo parceiro / colaborador [Nome Completo | Obrigatorio]```",
      });
      let userName = await DM.channel
        .awaitMessages({ filter, max: 1, time: 30_000, errors: ["time"] })
        .then((collected) => {
          return collected.first().content;
        })
        .catch(() =>
          console.log(
            `Você passou do tempo maximo de 30 segundos, por favor renicie o processo`
          )
        );
      await interactionUser.send(
        "```Agora insira a empresa do novo parceiro / colaborador [Obrigatorio]```"
      );
      let company = await DM.channel
        .awaitMessages({ filter, max: 1, time: 30_000, errors: ["time"] })
        .then((collected) => {
          return collected.first().content;
        })
        .catch(() =>
          console.log(
            `Você passou do tempo maximo de 30 segundos, por favor renicie o processo`
          )
        );
      await interactionUser.send(
        "```Agora insira o cargo do parceiro / colaborador [Obrigatorio]```"
      );
      let description = await DM.channel
        .awaitMessages({ filter, max: 1, time: 30_000, errors: ["time"] })
        .then((collected) => {
          return collected.first().content;
        })
        .catch(() =>
          console.log(
            `Você passou do tempo maximo de 30 segundos, por favor renicie o processo`
          )
        );
      await interactionUser.send(
        "```Agora insira o email do parceiro / colaborador [Obrigatorio PARA FAZER LOGIN NO CDD COM ESSE EMAIL]```"
      );
      let email = await DM.channel
        .awaitMessages({ filter, max: 1, time: 30_000, errors: ["time"] })
        .then((collected) => {
          return collected.first().content;
        })
        .catch(() =>
          console.log(
            `Você passou do tempo maximo de 30 segundos, por favor renicie o processo`
          )
        );
      await interactionUser.send(
        "```Agora insira o avatar do parceiro / colaborador [Opicional / Para passar digite skip]```"
      );
      let avatar = await DM.channel
        .awaitMessages({ filter, max: 1, time: 120_000, errors: ["time"] })
        .then((collected) => {
          return collected.first().content;
        })
        .catch(() =>
          console.log(
            `Você passou do tempo maximo de 30 segundos, por favor renicie o processo`
          )
        );
      await interactionUser.send(
        "```Digite a senha do CDD para o novo parceiro / colaborador [Obrigatorio]```"
      );
      let password = await DM.channel
        .awaitMessages({ filter, max: 1, time: 30_000, errors: ["time"] })
        .then((collected) => {
          return collected.first().content;
        })
        .catch(() =>
          console.log(
            `Você passou do tempo maximo de 30 segundos, por favor renicie o processo`
          )
        );
      await interactionUser.send(
        "```Digite o nivel de acesso do novo parceiro / colaborador na empresa [Obrigatorio | 1 - Acesso Basico | 2 - Acesso de Supervisor | 3 - Acesso de Administrador | 4 - Acesso Total]```"
      );
      let companyRule = await DM.channel
        .awaitMessages({ filter, max: 1, time: 30_000, errors: ["time"] })
        .then((collected) => {
          return collected.first().content;
        })
        .catch(() =>
          console.log(
            `Você passou do tempo maximo de 30 segundos, por favor renicie o processo`
          )
        );
      await interactionUser.send(
        "```Digite o Squad que o colaborador pertence [Opicional / Para passar digite skip]```"
      );
      let squad = await DM.channel
        .awaitMessages({ filter, max: 1, time: 30_000, errors: ["time"] })
        .then((collected) => {
          return collected.first().content;
        })
        .catch(() =>
          console.log(
            `Você passou do tempo maximo de 30 segundos, por favor renicie o processo`
          )
        );
      await interactionUser.send(
        "```Digite os projetos que o colaborador participa [digite os projetos de uma vez separando cara um por espaço] [Opicional / Para passar digite skip]```"
      );
      let projects = await DM.channel
        .awaitMessages({ filter, max: 1, time: 30_000, errors: ["time"] })
        .then((collected) => {
          return collected.first().content;
        })
        .catch(() =>
          console.log(
            `Você passou do tempo maximo de 30 segundos, por favor renicie o processo`
          )
        );

      const projectsArray = projects.split(" ");

      const userData = {
        name: userName,
        avatar: avatar,
        description: description,
        status: "Offline",
        company: company,
        companyId: company === "Complette" ? 0 : 1,
        companyRule: parseInt(companyRule),
        email: email,
        password: password,
        preferences: {
          darkMode: false,
        },
        Squad: squad === "skip" ? null : squad,
        projects: projectsArray[0] === "skip" ? [] : projectsArray,
      };

      const embedConfirm = await createEmbed(userData);

      await interactionUser.send({ embeds: [embedConfirm] });
      await interactionUser.send(
        "```Confirme agora se tudo está correto, digite ok para confirmar```"
      );
      let isOk = await DM.channel
        .awaitMessages({ filter, max: 1, time: 30_000, errors: ["time"] })
        .then((collected) => {
          if (collected.first().content.toLowerCase() === "ok") {
            return true;
          } else {
            return false;
          }
        })
        .catch(() =>
          console.log(
            `Você passou do tempo maximo de 30 segundos, por favor renicie o processo`
          )
        );

      if (!isOk) {
        return await invokedChannel.send("```Cancelado pelo usuario```");
      }

      await interactionUser.send("```Criando usuario aguarde...```");
      const userCreation = await createUser(userData);
      await interactionUser.send(userCreation);
      await invokedChannel.send("```Novo usuario criado com sucesso!```");
      await invokedChannel.send({
        embeds: [embedConfirm],
      });
    }

    if (interaction.options._subcommand === "delete") {
      const interactionUser = await interaction.guild.members.cache.get(
        interaction.user.id
      );
      const roles = interactionUser._roles;
      const userIsAdmin = roles.find((role) => role === "847465165725106207");
      const userName = interaction.options.getString("nome_do_colaborador");

      if (!userIsAdmin) {
        return interaction.reply(
          "Você precisa ser administrador para poder executar esse comando"
        );
      }

      const userData = await getUserByName(userName, true);

      if (!userData) {
        return interaction.reply("```Usuario não encontrado```");
      }

      const embedConfirm = await createEmbed(userData, "delete");
      await interaction.channel.send({ embeds: [embedConfirm] });

      const deleteUserOptions = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("delete")
          .setLabel("Deletar")
          .setStyle("DANGER")
      );

      

      await interaction.reply({
        content: "Deletar esse usuario?",
        ephemeral: true,
        components: [deleteUserOptions],
      });

      const collector = interaction.channel.createMessageComponentCollector({
        time: 15000,
      })

      collector.on("collect", async (i) => {
        if (i.customId === "delete") {
          await interaction.channel.send({content: "```Deletando usuario aguarde...```", ephemeral: true});
          const userDeletion = await deleteUser(userData);
          await interaction.channel.send(userDeletion);
          collector.stop();
        }
      })
    }
  },
};
