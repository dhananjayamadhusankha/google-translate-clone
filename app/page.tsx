import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="">
      <h1>Home</h1>
      <Link href="/translate">Translate Now</Link>
    </main>
  );
}
