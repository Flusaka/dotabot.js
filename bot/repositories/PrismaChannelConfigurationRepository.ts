import { inject, injectable } from "inversify";
import { ChannelConfiguration } from "../domain/ChannelConfiguration";
import type { ChannelConfigurationRepository } from "./interfaces/ChannelConfigurationRepository";
import { Types } from "../di/Types";
import type { PrismaClient } from "../../generated/prisma/client";
import { ChannelConfigurationMapper } from "../mappers/ChannelConfigurationMapper";

@injectable()
export class PrismaChannelConfigurationRepository implements ChannelConfigurationRepository {
    constructor(@inject(Types.PrismaClient) private prisma: PrismaClient) {
    }

    async getByChannelId(channelId: bigint): Promise<ChannelConfiguration | undefined> {
        const channelConfig = await this.prisma.channelConfiguration.findUnique({where: { channelId: channelId }});
        if(!channelConfig) {
            return undefined;
        }

        return ChannelConfigurationMapper.toDomain(channelConfig);
    }

    getById(id: number): Promise<ChannelConfiguration> {
        throw new Error("Method not implemented.");
    }
    
    async create(entity: Omit<ChannelConfiguration, "id">): Promise<ChannelConfiguration> {
        const model = ChannelConfigurationMapper.toModel(entity);
        const result = await this.prisma.channelConfiguration.create({data: model});
        return ChannelConfigurationMapper.toDomain(result);
    }

    async update(id: number, entity: Partial<Omit<ChannelConfiguration, "id">>): Promise<boolean> {
        const model = ChannelConfigurationMapper.toPartialModel(entity);
        const result = await this.prisma.channelConfiguration.update({
            where: { id },
            data: model
        });
        if(!result) {
            return false;
        }
        return true;
    }

    async delete(id: number): Promise<boolean> {
        try {
            await this.prisma.channelConfiguration.delete({ where: { id: id } });
            return true;
        } catch(e: unknown) {
            return false;
        }
    }
}