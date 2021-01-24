export interface HeaderProps {
  siteTitle?: string;
  setAccountAddress: React.Dispatch<React.SetStateAction<string>>;
  accountPair: Record<string, unknown>;
}
