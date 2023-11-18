"use client";
import TransactionForm from "@/components/forms/TransactionForm";
import WalletForm from "@/components/forms/WalletForm";
import useLocalStorageWallet from "@/hooks/useWallet";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function Home() {
  const wallet = useLocalStorageWallet();

  return <main>{wallet ? <TransactionForm /> : <WalletForm />}</main>;
}
