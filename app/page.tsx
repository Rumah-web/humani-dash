import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import { auth } from "@/auth"

export const metadata: Metadata = {
  title: "Humani | Dashboard ",
  description: "Dashboard for Humani",
  // other metadata
};

export default async function Home() {
  const session = await auth()

  return (
    <>
      {JSON.stringify(session)}
      <ECommerce />
    </>
  );
}
