import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

type LayoutProps = {
  headerVariant?: "full" | "minimal";
};

export default function Layout({ headerVariant = "full" }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header variant={headerVariant} />
      <main className="flex-1 flex flex-col px-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
