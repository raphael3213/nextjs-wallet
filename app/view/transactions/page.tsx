"use client";
import { TransactionColumn } from "@/lib/types/transaction.types";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import useLocalStorageWallet from "@/hooks/useLocalStorageWallet";
import { fetchAllTransaction } from "@/lib/actions/transaction.actions";
import { isErrorType } from "@/lib/type-guards/error.type-guard";
import toast from "react-hot-toast";
import TransactionTable from "@/components/tables/TransactionTable";

export default function Page() {
  const {
    data: walletKsuid,
    isSuccess: isWalletSuccess,
    isLoading: isWalletLoading,
    isError: isWalletError,
  } = useLocalStorageWallet();

  if (isWalletLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading
      </div>
    );
  }

  if (isWalletError) {
    return (
      <div className="flex justify-center items-center min-h-screen">Error</div>
    );
  }

  if (isWalletSuccess && walletKsuid != null) {
    return <TransactionTable walletKsuid={walletKsuid} />;
  } else {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Please initialize wallet
      </div>
    );
  }
}
