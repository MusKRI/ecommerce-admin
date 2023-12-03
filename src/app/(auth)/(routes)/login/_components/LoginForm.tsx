"use client";

// **** Library Imports ****
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// ***** Local Imports ****
// ui
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form/form";
import { Input } from "@/components/ui/input/input";
import { Button } from "@/components/ui/button/button";

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginFormValues = z.infer<typeof FormSchema>;

const LoginForm = () => {
  const [isLogging, setIsLogging] = useState(false);
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: LoginFormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLogging(true);
    const loading = toast.loading("Checking...");

    const signInData = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (!signInData?.ok) {
      setIsLogging(false);
      toast.dismiss(loading);
      return toast.error("Invalid Credentials!");
    }

    setIsLogging(false);
    toast.dismiss(loading);
    toast.success("Logged in!");
    router.push("/");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold">Log in</h2>
        <p className="text-slate-500">to continue to Ecommerce Admin</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="!mt-1"
                      placeholder="example@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="!mt-1"
                      placeholder="Your Password..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              variant="default"
              type="submit"
              className="mt-3 flex items-center justify-center disabled:cursor-not-allowed"
              disabled={isLogging}
            >
              {isLogging ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>Log in</span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
