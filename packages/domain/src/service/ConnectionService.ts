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
  connect(channelId: string, serverId: string): Promise<ConnectionResult>;
  disconnect(channelId: string): Promise<DisconnectionResult>;
  disconnectAll(serverId: string): Promise<void>;
}
