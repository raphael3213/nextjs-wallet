"use client";
import { TransactionColumn } from "@/lib/types/transaction.types";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import useLocalStorageWallet from "@/hooks/useLocalStorageWallet";
import { fetchAllTransaction } from "@/lib/actions/transaction.actions";
import { isErrorType } from "@/lib/type-guards/error.type-guard";
import toast from "react-hot-toast";

export default function Page() {
  const {
    data: walletKsuid,
    isSuccess: isWalletSuccess,
    isLoading: isWalletLoading,
    isError: isWalletError,
  } = useLocalStorageWallet();
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      if (walletKsuid) {
        const transaction = await fetchAllTransaction(walletKsuid, 0);
        if (isErrorType(transaction)) {
          toast.error(transaction.errorMessage);
          throw new Error(transaction.errorMessage);
        }
        return transaction;
      } else {
        toast.error("No wallet initialized");
      }
    },
    enabled: isWalletSuccess && walletKsuid != null,
  });

  if (isWalletError || (isWalletSuccess && walletKsuid == null)) {
    toast.error("No wallet initialized");
    return (
      <div className="flex justify-center items-center min-h-screen">
        Please initialize a wallet
      </div>
    );
  } else if (isError) {
    return (
      <div className="flex justify-center items-cente">
        Error in loading Table
      </div>
    );
  } else if (isWalletSuccess && isSuccess) {
    return (
      <div className="container mx-auto py-24 flex gap-3 flex-col">
        <h1 className="text-2xl">Transaction Table</h1>
        {isLoading || isWalletLoading ? (
          <div className="flex justify-center items-center">
            {" "}
            Loading Table{" "}
          </div>
        ) : (
          <DataTable columns={columns} data={data as TransactionColumn[]} />
        )}
      </div>
    );
  } else {
    return (
      <div className="flex justify-center items-cente">
        Error in loading Page
      </div>
    );
  }
}
