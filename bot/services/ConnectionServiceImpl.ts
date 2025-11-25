import { inject, injectable } from "inversify";
import { ConnectionResult, type ConnectionService, type DisconnectionResult } from "./interfaces/ConnectionService";
import { Types } from "../di/Types";
import type { ChannelConfigurationRepository } from "../repositories/interfaces/ChannelConfigurationRepository";

@injectable()
export class ConnectionServiceImpl implements ConnectionService {
    constructor(
        @inject(Types.ChannelConfigurationRepository) private channelConfigRepo: ChannelConfigurationRepository
    ) { }

    async connect(channelId: bigint): Promise<ConnectionResult> {
        const existing = await this.channelConfigRepo.getByChannelId(channelId);
        if(existing) {
            return ConnectionResult.ChannelAlreadyConnected;
        }

        const result = await this.channelConfigRepo.create({channelId: channelId});
        if(!result) {
            return ConnectionResult.UnknownError;
        }
        return ConnectionResult.Success;
    }
    disconnect(channelId: bigint): Promise<DisconnectionResult> {
        throw new Error("Method not implemented.");
    }

}