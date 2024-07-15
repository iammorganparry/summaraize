import Link from "next/link";

import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });

  // void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center ">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="text-5xl">that</span>rundown.
          </h1>
          <img
            src="https://i.makeagif.com/media/6-16-2021/ldSzfr.gif"
            alt="thatrundown gif"
          />
          <h3 className="text-2xl font-bold text-center">We almost have it.</h3>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="/privacy-policy"
          >
            <p className="text-sm font-bold">Privacy policy</p>
          </Link>
        </div>
      </main>
    </HydrateClient>
  );
}
