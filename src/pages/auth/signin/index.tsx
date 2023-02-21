import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Divider from "@/components/ui/Divider";

import FormGroup from "../../../components/form/FormGroup";
import Input from "../../../components/form/Input";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/Button";
import Section from "../../../components/ui/Section";
import { getEmailDomain } from "../../../utils/auth";

const signInSchema = z.object({
  email: z
    .string()
    .email()
    .refine(
      (email) =>
        process.env.NODE_ENV !== "production"
          ? true
          : getEmailDomain(email) === "connect.polyu.hk",
      {
        message: "Please enter your PolyU email address",
      }
    ),
});

type SignInPageProps = {};

const SignInPage: NextPage<SignInPageProps> = () => {
  const router = useRouter();
  const { status } = useSession();

  const { register, handleSubmit, formState, getValues } = useForm<
    z.infer<typeof signInSchema>
  >({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (data: z.infer<typeof signInSchema>) => {
    signInMutation.mutate(data.email);
  };

  const signInMutation = useMutation({
    mutationFn: (email: string) => signIn("email", { email }),
  });

  const handlePreviewSignIn = () => {
    handleSubmit(() => signInMutation.mutate(getValues("email")))();
  };

  if (status === "loading") return <h1 className="text-2xl">Loading...</h1>;

  if (status === "authenticated") {
    router.push("/subjects");
    return null;
  }

  return (
    <div className="flex h-1/2 items-center justify-center">
      <Section className="flex h-4/5 p-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-grow flex-col items-center justify-start"
        >
          <h1 className="mb-2 text-2xl">Sign in / Sign up</h1>
          <Divider />
          <FormGroup className="mb-7 mt-4" error={!!formState.errors.email}>
            <Label text="PolyU Email" />
            <Input
              className="w-[16rem]"
              {...register("email")}
              errorText={formState.errors.email?.message}
            />
          </FormGroup>

          <Button
            type="submit"
            primary
            className="mt-auto"
            isLoading={signInMutation.isLoading}
          >
            Sign In
          </Button>

          <Button
            type="button"
            primary
            className={clsx(
              process.env.ENVIRONMENT === "production" && "hidden",
              "mt-2"
            )}
            isLoading={signInMutation.isLoading}
            onClick={handlePreviewSignIn}
          >
            Dev Sign in
          </Button>
        </form>
      </Section>
    </div>
  );
};

export default SignInPage;
