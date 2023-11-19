"use client";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createWallet } from "@/lib/actions/wallet.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { isErrorType } from "@/lib/type-guards/error.type-guard";

function WalletForm() {
  const WalletValidation = z.object({
    name: z.string().min(1),
    balance: z.coerce.number().min(1).optional(),
  });
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof WalletValidation>>({
    resolver: zodResolver(WalletValidation),
    defaultValues: {
      name: "",
      balance: 100,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof WalletValidation>) => {
      const wallet = await createWallet(values);
      if (isErrorType(wallet)) {
        throw new Error(wallet.errorMessage);
      }
      return wallet;
    },
    onSuccess: (wallet) => {
      localStorage.setItem("wallet", wallet.ksuid);
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
    onError: async (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl">Create your Wallet</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="">Wallet Name</FormLabel>
                <FormControl className="">
                  <Input
                    type="text"
                    placeholder="Name..."
                    className=""
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="balance"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="">Balance</FormLabel>
                <FormControl className="">
                  <Input
                    type="number"
                    placeholder="Balance..."
                    className=""
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="comment-form_btn mt-3"
            disabled={mutation.isPending}
          >
            Create Wallet
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default WalletForm;
