require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const axios = require("axios");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("/ia")) {
    const pregunta = message.content.replace("/ia", "").trim();
    console.log(`👉 Recibido: ${pregunta}`);

    try {
      await axios.post(process.env.N8N_WEBHOOK_URL, {
        user: message.author.username,
        content: pregunta,
        channelId: message.channel.id
      });

      // Respuesta embellecida con Embed
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("📨 Pregunta enviada a la IA")
        .setDescription(`**${pregunta}**\n\n⌛ Espera un momento mientras procesamos tu respuesta...`)
        .setFooter({ text: "IA Bot • Potenciado con n8n y OpenRouter" })
        .setTimestamp();

      await message.reply({ embeds: [embed] });

    } catch (error) {
      console.error("❌ Error enviando a n8n:", error.message);

      const errorEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("⚠️ Error")
        .setDescription("Ocurrió un error al enviar tu mensaje a la IA.")
        .setTimestamp();

      await message.reply({ embeds: [errorEmbed] });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

//node index.js