"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/top");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center p-6 text-slate-700">
      <p>
        移動中です…{" "}
        <Link href="/top" className="underline">
          トップページはこちら
        </Link>
      </p>
    </main>
  );
}