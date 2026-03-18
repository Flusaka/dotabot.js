export const ResultStatus = {
  Success: "success",
} as const;
export type ResultStatus = (typeof ResultStatus)[keyof typeof ResultStatus];

export const ConnectedChannelResultStatus = {
  ...ResultStatus,
  NotConnected: "notConnected",
} as const;
export type ConnectedChannelResultStatus =
  (typeof ConnectedChannelResultStatus)[keyof typeof ConnectedChannelResultStatus];
