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
import { useMutation } from "@tanstack/react-query";

function TransactionForm({ walletKsuid }: { walletKsuid: string }) {
  const TransactionValidation = z.object({
    description: z.string().min(1),
    amount: z.coerce.number().min(1),
    type: z.enum(["CREDIT", "DEBIT"], {
      required_error: "You need to select a notification type.",
    }),
  });

  const form = useForm<z.infer<typeof TransactionValidation>>({
    resolver: zodResolver(TransactionValidation),
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof TransactionValidation>) =>
      createTransaction(values, walletKsuid),

    onError: () => {},
  });

  return (
    <div>
      <div>Submit your transaction</div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
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
                    <FormItem className="">
                      <FormControl>
                        <RadioGroupItem value="DEBIT" />
                      </FormControl>
                      <FormLabel className="font-normal">DEBIT</FormLabel>
                    </FormItem>
                    <FormItem className="">
                      <FormControl>
                        <RadioGroupItem value="CREDIT" />
                      </FormControl>
                      <FormLabel className="font-normal">CREDIT</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="comment-form_btn">
            Reply
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default TransactionForm;
