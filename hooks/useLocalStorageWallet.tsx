"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

function useLocalStorageWallet() {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      console.log("IN wallet");
      if (localStorage.getItem("wallet")) {
        console.log("got data", localStorage.getItem("wallet"));
        return localStorage.getItem("wallet")!;
      } else {
        return null;
      }
    },
  });

  if (isError) {
    console.log(data);
  }

  return { data, isLoading, isError, isSuccess };
}

export default useLocalStorageWallet;
