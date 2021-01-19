export interface CardProps {
  auction: {
    name: string;
    start: number;
    end: number;
    auction_type: string;
    minimal_bid: number;
  };
}
