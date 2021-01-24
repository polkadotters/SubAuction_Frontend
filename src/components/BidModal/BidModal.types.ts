import { Auction } from '@/@types/auction';

export interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountPair: Record<string, unknown>;
  auction: Auction;
}
