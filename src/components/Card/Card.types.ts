import { Auction } from '@/@types/auction';
export interface CardProps {
  auction: Auction;
  accountPair: Record<string, unknown>;
  id: number;
  currentBlock: number;
}
