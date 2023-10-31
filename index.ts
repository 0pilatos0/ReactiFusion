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
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  reactions.forEach((reaction) => {
    if (
      reaction.keywords.some((keyword) => message.content.includes(keyword))
    ) {
      message.react(reaction.reaction);
    }
  });
});

client.login(process.env.TOKEN);
