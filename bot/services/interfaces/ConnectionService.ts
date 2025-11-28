export enum ConnectionResult {
  Success = 0,

  ChannelAlreadyConnected,

  UnknownError,
}

export enum DisconnectionResult {
  Success = 0,

  ChannelNotConnected,

  UnknownError,
}

export interface ConnectionService {
  connect(channelId: bigint): Promise<ConnectionResult>;
  disconnect(channelId: bigint): Promise<DisconnectionResult>;
}
