export interface Auction {
  id: number;
  name: string;
  last_bid: number;
  start: number;
  end: number;
  auction_type: string;
  minimal_bid: number;
  token_id: [number, number];
}
