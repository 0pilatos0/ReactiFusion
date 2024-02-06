import { Client, Events, GatewayIntentBits } from "discord.js";
import reactions from "./reactions.json";
import { db } from "./src/util/db";
import { ChannelSettingService } from "./src/Service/ChannelSettingService";
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
  let channelSetting = await ChannelSettingService.getChannelSetting(
    message.channel.id
  );
  if (channelSetting && !channelSetting.reactionsEnabled) return;

  let messageWords = message.content
    .split(" ")
    .map((word) => word.toLowerCase());
  reactions.forEach((reaction) => {
    messageWords.forEach((word) => {
      if (
        reaction.keywords
          .map((reaction) => reaction.toLowerCase())
          .includes(word)
      ) {
        message.react(reaction.reaction);

        if (reaction.timeout) {
          let guildMember = message.guild?.members.cache.get(message.author.id);
          if (!guildMember) return;

          guildMember
            .timeout(60 * 1000, "No Roles For You!")
            .then(() => {
              console.log("Timeout done");
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    });
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isCommand() && interaction.commandName === "disablechannel") {
    let channel = interaction.channel?.id;
    let guild = interaction.guild?.id;

    if (!channel || !guild) return;

    let channelSetting = await ChannelSettingService.getChannelSetting(channel);
    if (!channelSetting)
      ChannelSettingService.createChannelSetting(channel, guild, false);
    else {
      channelSetting.reactionsEnabled = false;
      ChannelSettingService.updateChannelSetting(channelSetting);
    }

    await interaction.reply(
      "Automatic reactions have been disabled in this channel."
    );
  }

  if (interaction.isCommand() && interaction.commandName === "enablechannel") {
    let channel = interaction.channel?.id;
    let guild = interaction.guild?.id;

    if (!channel || !guild) return;

    let channelSetting = await ChannelSettingService.getChannelSetting(channel);
    if (!channelSetting)
      ChannelSettingService.createChannelSetting(channel, guild, true);
    else {
      channelSetting.reactionsEnabled = true;
      ChannelSettingService.updateChannelSetting(channelSetting);
    }

    await interaction.reply(
      "Automatic reactions have been enabled in this channel."
    );
  }

  if (interaction.isCommand() && interaction.commandName === "checkchannel") {
    let channel = interaction.channel?.id;
    let guild = interaction.guild?.id;

    if (!channel || !guild) return;

    let reactionsEnabled = await ChannelSettingService.getReactionsEnabled(
      channel
    );

    if (reactionsEnabled)
      await interaction.reply(
        "Automatic reactions are enabled in this channel."
      );
    else
      await interaction.reply(
        "Automatic reactions are disabled in this channel."
      );
  }
});

client.login(process.env.TOKEN);
