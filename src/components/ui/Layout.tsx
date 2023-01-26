import Navbar from "./Navbar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = (props: LayoutProps) => {
  const { children } = props;

  return (
    <div className="flex h-screen min-h-screen flex-col">
      <Navbar />
      <main className="m-auto max-w-3xl flex-grow p-5 text-onBackground">
        {children}
      </main>
    </div>
  );
};

export default Layout;
