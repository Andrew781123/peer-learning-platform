export const signIn = async ({
  email,
  csrfToken,
}: {
  email: string;
  csrfToken: string;
}) => {
  const response = await fetch("/api/auth/signin/email", {
    method: "POST",
    body: JSON.stringify({
      email,
      csrfToken,
    }),
  });

  return response.json();
};
