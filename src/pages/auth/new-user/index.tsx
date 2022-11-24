import { NextPage } from "next";
import { useSession } from "next-auth/react";

type NewUserPageProps = {};

const NewUserPage: NextPage<NewUserPageProps> = (props) => {
  const {} = props;

  const { data, status } = useSession();

  console.log({ data, status });

  return <div>New User</div>;
};

export default NewUserPage;
