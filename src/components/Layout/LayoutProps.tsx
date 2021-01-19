export interface LayoutProps {
  setAccountAddress: React.Dispatch<React.SetStateAction<string>>;
  accountPair: object;
  children: React.ReactNode;
}
