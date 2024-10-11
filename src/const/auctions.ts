export enum LiveAuctionStatus {
  Active = "active",
  Finished = "finished",
  Closed = "closed",
}
export type SanitizedAuctionStatus = `${LiveAuctionStatus}`;
export type AuctionStatus = SanitizedAuctionStatus;
