import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { GetServerSideProps, NextPage } from "next";
import { getCsrfToken, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormGroup from "../../../components/form/FormGroup";
import Input from "../../../components/form/Input";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/Button";
import Section from "../../../components/ui/Section";
import { getEmailDomain } from "../../../utils/auth";

export const getServerSideProps: GetServerSideProps<SignInPageProps> = async (
  context
) => {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
};

const signInSchema = z.object({
  email: z
    .string()
    .email()
    .refine((email) => getEmailDomain(email) === "connect.polyu.hk", {
      message: "Please enter your PolyU email address",
    }),
});

type SignInPageProps = {
  csrfToken?: string;
};

const SignInPage: NextPage<SignInPageProps> = ({ csrfToken }) => {
  const { watch, register, handleSubmit, formState } = useForm<
    z.infer<typeof signInSchema>
  >({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(signInSchema),
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) =>
      console.log(value, name, type)
    );
    console.log("errors", formState.errors);
    return () => subscription.unsubscribe();
  }, [watch, formState]);

  const onSubmit = (data: z.infer<typeof signInSchema>) => {
    signInMutation.mutate(data.email);
  };

  const signInMutation = useMutation({
    mutationFn: (email: string) => signIn("email", { email }),
  });

  return (
    // TODO - fix the height
    <div className="flex h-1/2 items-center justify-center">
      <Section className="flex h-4/5 p-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex  flex-grow flex-col items-center justify-start divide-y-2 divide-gray-500"
        >
          <h1 className="mb-2 text-2xl">Sign in / Sign up</h1>
          <FormGroup className="mb-7 mt-4" error={!!formState.errors.email}>
            <Label text="Polyu Email" />
            <Input
              {...register("email")}
              errorText={formState.errors.email?.message}
            />
          </FormGroup>

          <Button type="submit" primary className="mt-auto">
            Sign In
          </Button>
        </form>
      </Section>
    </div>
  );
};

export default SignInPage;
