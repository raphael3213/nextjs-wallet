import { fetchWallet } from "@/lib/actions/wallet.action";
import { isErrorType } from "@/lib/type-guards/error.type-guard";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";

function WalletTotal({ walletKsuid }: { walletKsuid: string }) {
  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["walletTotal"],
    queryFn: async () => {
      if (walletKsuid) {
        const wallet = await fetchWallet(walletKsuid);
        if (isErrorType(wallet)) {
          toast.error(wallet.errorMessage);
          throw new Error(wallet.errorMessage);
        }
        return wallet;
      }
      return null;
    },
  });

  if (isLoading) {
    return <div>Wallet Total : Loading</div>;
  }
  if (isError) {
    return <div>Wallet Total : Error</div>;
  }
  if (isSuccess && data) {
    return <div>Wallet Total : {data.balance.toString()}</div>;
  }
  return <div>Wallet Total : Error</div>;
}

export default WalletTotal;
