const { SlashCommandBuilder } = require("@discordjs/builders");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const getLastRank = async () => {
  try {
    await client.connect();

    const db = client.db("cdd-base");
    const col = db.collection("bestof");

    const lastRank = await col.findOne()

    return lastRank;
  } finally {
    await client.close();
  }
};

const handleBests = async (bests) => {
  let bestsReturn = "";
  if (bests.length < 1) {
    return "Nenhum";
  }
  const topOne = bests.find((best) => best.Position === 1)?.Name || null;
  const topTwo = bests.find((best) => best.Position === 2)?.Name || null;
  const topThree = bests.find((best) => best.Position === 3)?.Name || null;

  bestsReturn = `🥇 ${topOne}  ${topTwo != null ? "🥈 " + topTwo : ""}  ${
    topThree != null ? "🥉 " + topThree : ""
  }`;
  return bestsReturn;
};

const createEmbed = async (embedContent) => {
  const {
    Title,
    Description,
    BestFinances,
    BestOperational,
    BestTechnology,
    BestAdministrative,
    BestSeniorDeveloper,
    BestDeveloper,
    BestJuniorDeveloper,
    BestTraineeDeveloper,
    BestMarketing,
    HonoredMention,
    BestPartnerDev,
  } = embedContent;
  const finances = await handleBests(BestFinances);
  const operational = await handleBests(BestOperational);
  const techonlogy = await handleBests(BestTechnology);
  const administrative = await handleBests(BestAdministrative);
  const seniorDeveloper = await handleBests(BestSeniorDeveloper);
  const developer = await handleBests(BestDeveloper);
  const juniorDeveloper = await handleBests(BestJuniorDeveloper);
  const traineeDeveloper = await handleBests(BestTraineeDeveloper);
  const marketing = await handleBests(BestMarketing);
  return (embed = {
    type: "rich",
    title: "🎖 " + Title,
    description: Description,
    color: 0x5a43a5,
    fields: [
      {
        name: `Financeiro`,
        value: finances,
      },
      {
        name: `Operacional`,
        value: operational,
      },
      {
        name: `Tecnologia`,
        value: techonlogy,
      },
      {
        name: `Administrativo`,
        value: administrative,
      },
      {
        name: `Senior Developer`,
        value: seniorDeveloper,
      },
      {
        name: `Developer`,
        value: developer,
      },
      {
        name: `Junior Developer`,
        value: juniorDeveloper,
      },
      {
        name: `Trainee Developer`,
        value: traineeDeveloper,
      },
      {
        name: `Marketing`,
        value: marketing,
      },
      {
        name: `Honored Mention`,
        value: `🏆 ${HonoredMention.Name} - ${HonoredMention.Reason}`,
      },
      {
        name: `Partner Dev`,
        value: `🏅 ${BestPartnerDev.Name}`,
      },
    ],
  });
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Retorna os melhores do mês"),
  async execute(interaction) {
    const embedContent = await getLastRank();
    const embed = await createEmbed(embedContent);
    await interaction.reply({ embeds: [embed] });
  },
};
