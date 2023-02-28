import Navbar from "./Navbar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = (props: LayoutProps) => {
  const { children } = props;

  return (
    <div className="flex min-h-screen flex-col items-center bg-background">
      <Navbar />
      <main className="w-full max-w-5xl flex-grow p-5 text-onBackground">
        {children}
      </main>
    </div>
  );
};

export default Layout;
