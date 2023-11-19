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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { TransactionType } from "@/lib/types/transaction.types";
import { createTransaction } from "@/lib/actions/transaction.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { isErrorType } from "@/lib/type-guards/error.type-guard";

function TransactionForm({ walletKsuid }: { walletKsuid: string }) {
  const queryClient = useQueryClient();
  const TransactionValidation = z.object({
    description: z.string().min(1),
    amount: z.coerce.number().min(1),
    type: z.enum(["CREDIT", "DEBIT"], {
      required_error: "You need to select a transaction type.",
    }),
  });

  const form = useForm<z.infer<typeof TransactionValidation>>({
    resolver: zodResolver(TransactionValidation),
    defaultValues: {
      description: "",
      amount: 100,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof TransactionValidation>) => {
      if (values.type === "DEBIT") values.amount = -values.amount;
      const transaction = await createTransaction(values, walletKsuid);
      if (isErrorType(transaction)) {
        throw new Error(transaction.errorMessage);
      }
      return transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["walletTotal"],
      });
      toast.success("Transaction created");
      //show toaster message
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl">Submit your transaction</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="">Transaction Description</FormLabel>
                <FormControl className="">
                  <Input
                    type="text"
                    placeholder="Description..."
                    className=""
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="">Amount</FormLabel>
                <FormControl className="">
                  <Input
                    type="number"
                    placeholder="Amount..."
                    className=""
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Transaction Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value as TransactionType}
                    required
                  >
                    <FormItem className="flex gap-2 justify-start items-center">
                      <FormControl>
                        <RadioGroupItem value="DEBIT" />
                      </FormControl>
                      <FormLabel className="mt-0">Debit</FormLabel>
                    </FormItem>
                    <FormItem className="flex gap-2 justify-start items-center">
                      <FormControl>
                        <RadioGroupItem value="CREDIT" />
                      </FormControl>
                      <FormLabel className="mt-0">Credit</FormLabel>
                    </FormItem>
                  </RadioGroup>
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
            Create Transaction
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default TransactionForm;
