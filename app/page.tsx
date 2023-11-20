"use client";
import TransactionForm from "@/components/forms/TransactionForm";
import WalletForm from "@/components/forms/WalletForm";
import useLocalStorageWallet from "@/hooks/useLocalStorageWallet";

export default function Home() {
  const { data, isLoading, isError } = useLocalStorageWallet();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen">Error</div>
    );
  }

  return (
    <main className="flex justify-center items-center min-h-screen">
      {data ? <TransactionForm walletKsuid={data} /> : <WalletForm />}
    </main>
  );
}
