"use client";

// **** Library Imports ****
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Store } from "@prisma/client";

// **** Local Imports ****
// ui
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form/form";
import { Input } from "@/components/ui/input/input";
import { Button } from "@/components/ui/button/button";
import Modal from "../ui/modal/modal";

// hooks
import { useStoreModal } from "@/hooks/use-store-modal";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Store name must contain at least 3 characters")
    .max(50, "Store name must contain at most 50 characters"),
});

type StoreModalFormValues = z.infer<typeof formSchema>;

export const StoreModal = () => {
  const storeModal = useStoreModal();
  const [loading, setLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<StoreModalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: StoreModalFormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const loadingToast = toast.loading("Wait...");

    try {
      setLoading(true);

      const response = await axios.post("/api/stores", values, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const createdStore = response.data.newStore as Store;

      window.location.assign(`/${createdStore.id}`);

      toast.success("Store created!");
    } catch (error) {
      const Error = error as AxiosError;
      toast.error(
        (Error.response?.data as { message: string; success: boolean })
          .message || "Something went wrong"
      );
    } finally {
      toast.dismiss(loadingToast);
      setLoading(false);
    }
  }

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Shoes Store"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be your store name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  variant="outline"
                  type="button"
                  onClick={storeModal.onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
