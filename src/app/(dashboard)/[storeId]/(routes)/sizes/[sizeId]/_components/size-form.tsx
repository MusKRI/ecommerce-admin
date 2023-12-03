"use client";
import { Size } from "@prisma/client";
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

type SizeFormProps = {
  initialData: Size | null;
};

const formSchema = z.object({
  name: z
    .string({ required_error: "Name is required!" })
    .min(1, "Name is required!"),
  value: z.string().min(1),
});

type SizeFormValues = z.infer<typeof formSchema>;

const SizeForm = ({ initialData }: SizeFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit size" : "Create size";
  const description = initialData ? "Edit a size" : "Add a new size";
  const successToastMessage = initialData ? "Size updated!" : "Size created!";
  const loadingToastMessage = initialData ? "Updating..." : "Creating...";
  const action = initialData ? "Save Changes" : "Create";

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const { isDirty } = form.formState;

  const onSubmit = async (values: SizeFormValues) => {
    console.log(values);
    const loadingToast = toast.loading(loadingToastMessage);

    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          values
        );
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, values);
      }

      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success(successToastMessage);
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

      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);

      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success("Size deleted!");
    } catch (error) {
      console.log("", error);
      toast.error("Make sure you removed all products using this size first.");
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
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            size="icon"
            variant="destructive"
            onClick={() => setOpen(true)}
            disabled={loading}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Size name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Size value"
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
            {action}
          </Button>
        </form>
      </Form>

      {/* <Separator />

      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      /> */}
    </>
  );
};

export default SizeForm;
