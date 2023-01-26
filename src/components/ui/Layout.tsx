import Navbar from "./Navbar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = (props: LayoutProps) => {
  const { children } = props;

  return (
    <div className="flex h-screen min-h-screen flex-col items-center">
      <Navbar />
      <main className="w-full max-w-3xl flex-grow p-5 text-onBackground">
        {children}
      </main>
    </div>
  );
};

export default Layout;
