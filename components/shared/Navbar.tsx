"use client";
import useLocalStorageWallet from "@/hooks/useLocalStorageWallet";
import { fetchWallet } from "@/lib/actions/wallet.action";
import { isErrorType } from "@/lib/type-guards/error.type-guard";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import WalletTotal from "../cards/WalletTotal";

function Navbar() {
  const {
    data: walletKsuid,
    isSuccess: isWalletSuccess,
    isLoading: isWalletLoading,
    isError: isWalletError,
  } = useLocalStorageWallet();

  return (
    <div className="bg-black w-full p-4 flex items-center justify-between fixed">
      <div className="text-white flex gap-4">
        <Link className="hover:text-yellow-300" href={"/"}>
          Home Page
        </Link>
        <Link className="hover:text-yellow-300" href={"/view/transactions"}>
          Show Transactions
        </Link>
      </div>
      <div className="text-white">
        {isWalletSuccess && walletKsuid != null ? (
          <WalletTotal walletKsuid={walletKsuid} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Navbar;
