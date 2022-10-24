import Navbar from "./Navbar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = (props: LayoutProps) => {
  const { children } = props;

  return (
    <>
      <Navbar />
      <main className="p-5 text-onBackground">{children}</main>
    </>
  );
};

export default Layout;
