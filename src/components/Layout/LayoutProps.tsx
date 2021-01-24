export interface LayoutProps {
  setAccountAddress: React.Dispatch<React.SetStateAction<string>>;
  accountPair: Record<string, unknown>;
  children: React.ReactNode;
}
