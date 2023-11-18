"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

function useLocalStorageWallet() {
  const { data } = useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      if (localStorage.getItem("wallet")) {
        return localStorage.getItem("wallet");
      } else {
        return null;
      }
    },
  });

  return data;
}

export default useLocalStorageWallet;
