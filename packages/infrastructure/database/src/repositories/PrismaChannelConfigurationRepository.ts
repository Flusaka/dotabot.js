import { inject, injectable } from "inversify";
import { ChannelConfigurationMapper } from "../mappers/ChannelConfigurationMapper";
import type { ChannelConfiguration } from "@dotabot.js/domain/ChannelConfiguration";
import type { ChannelConfigurationRepository } from "@dotabot.js/domain/repository/ChannelConfigurationRepository";
import { Symbols } from "../di/Symbols";
import prisma from "../prisma";

@injectable()
export class PrismaChannelConfigurationRepository implements ChannelConfigurationRepository {
  async getByChannelId(
    channelId: bigint,
  ): Promise<ChannelConfiguration | undefined> {
    const channelConfig = await prisma.channelConfiguration.findUnique({
      where: { channelId: channelId },
    });
    if (!channelConfig) {
      return;
    }

    return ChannelConfigurationMapper.toDomain(channelConfig);
  }

  getById(id: number): Promise<ChannelConfiguration> {
    throw new Error("Method not implemented.");
  }

  async create(
    entity: Omit<ChannelConfiguration, "id">,
  ): Promise<ChannelConfiguration> {
    const model = ChannelConfigurationMapper.toModel(entity);
    const result = await prisma.channelConfiguration.create({
      data: model,
    });
    return ChannelConfigurationMapper.toDomain(result);
  }

  async update(
    id: number,
    entity: Partial<Omit<ChannelConfiguration, "id">>,
  ): Promise<boolean> {
    const model = ChannelConfigurationMapper.toPartialModel(entity);
    const result = await prisma.channelConfiguration.update({
      where: { id },
      data: model,
    });
    if (!result) {
      return false;
    }
    return true;
  }

  async deleteByChannelId(channelId: bigint): Promise<boolean> {
    try {
      await prisma.channelConfiguration.delete({
        where: { channelId: channelId },
      });
      return true;
    } catch (e: unknown) {
      return false;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.channelConfiguration.delete({
        where: { id: id },
      });
      return true;
    } catch (e: unknown) {
      return false;
    }
  }
}
