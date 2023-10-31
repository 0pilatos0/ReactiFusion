import { ChannelSettings } from "@prisma/client";
import { db } from "../util/db";

export class ChannelSettingService {
  static async getChannelSetting(channelId: string) {
    return await db.channelSettings.findUnique({
      where: {
        channelId: channelId,
      },
    });
  }

  static async createChannelSetting(
    channelId: string,
    guildId: string,
    reactionsEnabled: boolean = true
  ) {
    await db.channelSettings.create({
      data: {
        channelId: channelId,
        guildId: guildId,
        reactionsEnabled: reactionsEnabled,
      },
    });
  }

  static async updateChannelSetting(channelSetting: ChannelSettings) {
    await db.channelSettings.update({
      where: {
        channelId: channelSetting.channelId,
      },
      data: {
        reactionsEnabled: channelSetting.reactionsEnabled,
      },
    });
  }

  static async getReactionsEnabled(channelId: string): Promise<boolean> {
    const channelSetting = await this.getChannelSetting(channelId);
    if (channelSetting === null) {
      return true;
    }
    return channelSetting.reactionsEnabled;
  }
}
