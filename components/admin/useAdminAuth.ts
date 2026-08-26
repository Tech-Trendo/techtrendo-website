"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function useAdminAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { authenticated?: boolean }) => {
        if (cancelled) return;
        setAuthed(Boolean(data.authenticated));
        setChecked(true);
        if (!data.authenticated) {
          const next = encodeURIComponent(pathname);
          router.replace(`/dash/login?next=${next}`);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setChecked(true);
        router.replace("/dash/login");
      });
    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  return { checked, authed };
}