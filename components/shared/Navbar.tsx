"use client";
import useLocalStorageWallet from "@/hooks/useLocalStorageWallet";
import { fetchWallet } from "@/lib/actions/wallet.action";
import { isErrorType } from "@/lib/type-guards/error.type-guard";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";

function Navbar() {
  const {
    data: walletKsuid,
    isSuccess: isWalletSuccess,
    isLoading: isWalletLoading,
    isError: isWalletError,
  } = useLocalStorageWallet();

  const { data, isLoading, isSuccess } = useQuery({
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
    },
    enabled: isWalletSuccess,
  });

  return (
    <div className="bg-black w-full p-4 flex items-center justify-between fixed">
      <div className="text-white flex gap-4">
        <Link href={"/"}>Home Page</Link>
        <Link href={"/view/transactions"}>Show Transactions</Link>
      </div>
      <div className="text-white">
        Wallet Balance :{" "}
        {isWalletLoading || isLoading ? "Loading" : data?.balance?.toString()}
      </div>
    </div>
  );
}

export default Navbar;
