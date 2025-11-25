import { inject, injectable } from "inversify";
// import prisma from "../../database/prisma";
import type { ChannelConfiguration } from "../domain/ChannelConfiguration";
import type { ChannelConfigurationRepository } from "./interfaces/ChannelConfigurationRepository";
import { Types } from "../di/Types";
import type { PrismaClient } from "../../generated/prisma/client";

@injectable()
export class PrismaChannelConfigurationRepository implements ChannelConfigurationRepository {
    constructor(@inject(Types.PrismaClient) private prisma: PrismaClient) {
    }

    async getByChannelId(channelId: bigint): Promise<ChannelConfiguration | undefined> {
        const channelConfig = await this.prisma.channelConfiguration.findUnique({where: { channelId: channelId }});
        if(!channelConfig) {
            return undefined;
        }

        return {
            id: channelConfig.id,
            channelId: channelConfig.channelId
        };
    }

    getById(id: number): Promise<ChannelConfiguration> {
        throw new Error("Method not implemented.");
    }
    
    async create(entity: Omit<ChannelConfiguration, "id">): Promise<ChannelConfiguration> {
        // TODO: Map properly, in case domain and data diverge
        const result = await this.prisma.channelConfiguration.create({data: { ...entity } } );
        return result;
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