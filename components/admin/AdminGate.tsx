"use client";

import { Loader2 } from "lucide-react";
import { useAdminAuth } from "@/components/admin/useAdminAuth";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const auth = useAdminAuth();
  if (!auth.checked) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  return <>{children}</>;
}
