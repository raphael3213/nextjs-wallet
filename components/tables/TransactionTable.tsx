import { columns } from "@/app/view/transactions/columns";
import { DataTable } from "@/app/view/transactions/data-table";
import { fetchAllTransaction } from "@/lib/actions/transaction.actions";
import { isErrorType } from "@/lib/type-guards/error.type-guard";
import { TransactionColumn } from "@/lib/types/transaction.types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";
import { CSVLink, CSVDownload } from "react-csv";
import { Button } from "../ui/button";
function TransactionTable({ walletKsuid }: { walletKsuid: string }) {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const transaction = await fetchAllTransaction(walletKsuid, 0);
      if (isErrorType(transaction)) {
        toast.error(transaction.errorMessage);
        throw new Error(transaction.errorMessage);
      }
      return transaction;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">Table Loading</div>
    );
  }
  if (isError) {
    return (
      <div className="flex justify-center items-center">
        Error Fetching Data
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto py-24 flex gap-3 flex-col">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">Transaction Table</h1>

          <CSVLink
            data={data}
            separator={";"}
            className="bg-black rounded-md p-2 shadow-md hover:cursor-pointer text-white"
            filename="my-transactions"
          >
            Export CSV
          </CSVLink>
        </div>

        <DataTable columns={columns} data={data as TransactionColumn[]} />
      </div>
    );
  }
}

export default TransactionTable;
