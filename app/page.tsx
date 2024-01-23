import { Metadata } from "next";
import { auth } from "@/auth"
import Statistic from "@/components/Dashboard/Statistic";

export const metadata: Metadata = {
  title: "Humani | Dashboard ",
  description: "Dashboard for Humani",
  // other metadata
};

export default async function Home() {
  const session = await auth()

  return (
    <>
      <Statistic />
    </>
  );
}
