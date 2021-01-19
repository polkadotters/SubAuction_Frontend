export interface CreateAuctionProps {
  isOpen: boolean;
  onClose: () => void;
  accountPair: Record<string, unknown>;
}
