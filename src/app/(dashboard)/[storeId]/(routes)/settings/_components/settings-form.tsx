"use client";
import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";

import Heading from "@/components/ui/heading/heading";
import { Button } from "@/components/ui/button/button";
import { Separator } from "@/components/ui/separator/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form/form";
import { Input } from "@/components/ui/input/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert/api-alert";

import { useOrigin } from "@/hooks/use-origin";

type SettingsFormProps = {
  initialData: Store;
};

const formSchema = z.object({
  name: z
    .string({ required_error: "Store name is required!" })
    .min(1, "Store name is required!"),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const router = useRouter();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isDirty } = form.formState;

  const onSubmit = async (values: SettingsFormValues) => {
    const loadingToast = toast.loading("Updating...");

    try {
      setLoading(true);

      await axios.patch(`/api/stores/${params.storeId}`, values);
      router.refresh();
      form.reset(undefined, { keepValues: true });
      toast.success("Settings update!");
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
  };

  const onDelete = async () => {
    const loadingToast = toast.loading("Processing...");

    try {
      setLoading(true);

      await axios.delete(`/api/stores/${params.storeId}`);

      router.refresh();
      router.push("/");
      toast.success("Store deleted!");
    } catch (error) {
      console.log("", error);
      toast.error("Make sure you removed all products and categories first.");
    } finally {
      toast.dismiss(loadingToast);
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store preferences" />
        <Button
          size="icon"
          variant="destructive"
          onClick={() => setOpen(true)}
          disabled={loading}
        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Store name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <Button
            disabled={loading || !isDirty}
            className="ml-auto"
            type="submit"
          >
            Save Changes
          </Button>
        </form>
      </Form>

      <Separator />

      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
};

export default SettingsForm;
