import { Client, Events, GatewayIntentBits } from "discord.js";
import reactions from "./reactions.json";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client?.user?.tag}!`);
  client.user?.setActivity("with emojis");
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  /**
   * Check if a quick reaction is needed
   */
  let messageWords = message.content
    .split(" ")
    .map((word) => word.toLowerCase());
  reactions.forEach((reaction) => {
    messageWords.forEach((word) => {
      if (reaction.keywords.includes(word)) message.react(reaction.reaction);
    });
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isCommand() && interaction.commandName === "disablechannel") {
    await interaction.reply(
      "Automatic reactions have been disabled in this channel."
    );
  }

  if (interaction.isCommand() && interaction.commandName === "enablechannel") {
    await interaction.reply(
      "Automatic reactions have been enabled in this channel."
    );
  }
});

client.login(process.env.TOKEN);
