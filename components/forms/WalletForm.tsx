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

function WalletForm() {
  const WalletValidation = z.object({
    name: z.string().min(1),
    balance: z.coerce.number().min(1).optional(),
  });
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof WalletValidation>>({
    resolver: zodResolver(WalletValidation),
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof WalletValidation>) => {
      return createWallet(values);
    },
    onSuccess: (wallet) => {
      localStorage.setItem("wallet", wallet.ksuid);
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
    onError: () => {},
  });
  // const onSubmit = async (values: z.infer<typeof WalletValidation>) => {
  //   try {
  //     mutation.mutate(values);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div>
      <div>Create Your Wallet</div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
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
            className="comment-form_btn"
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
