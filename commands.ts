import {
  PermissionFlagsBits,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";

const disablechannel = new SlashCommandBuilder()
  .setName("disablechannel")
  .setDescription("Disable automatic reactions in this channel")
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

const enablechannel = new SlashCommandBuilder()
  .setName("enablechannel")
  .setDescription("Enable automatic reactions in this channel")
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

const checkChannel = new SlashCommandBuilder()
  .setName("checkchannel")
  .setDescription("Check if automatic reactions are enabled in this channel")
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

const commands = [disablechannel, enablechannel, checkChannel];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN as string);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID as string), {
    body: commands,
  });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}
