import Navbar from "./Navbar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = (props: LayoutProps) => {
  const { children } = props;

  return (
    <>
      <Navbar />
      <main className="m-auto max-w-3xl p-5 text-onBackground">{children}</main>
    </>
  );
};

export default Layout;
