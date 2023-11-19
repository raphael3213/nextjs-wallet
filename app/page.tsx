"use client";
import TransactionForm from "@/components/forms/TransactionForm";
import WalletForm from "@/components/forms/WalletForm";
import useLocalStorageWallet from "@/hooks/useWallet";

export default function Home() {
  const { data, isLoading, isError } = useLocalStorageWallet();

  if (isLoading) {
    return <div>Loading</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }

  return (
    <main>
      {data ? <TransactionForm walletKsuid={data} /> : <WalletForm />}
    </main>
  );
}
