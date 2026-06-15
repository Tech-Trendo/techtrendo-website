import ServiceQuote from "@/components/ServiceQuote";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServiceQuote />
    </Suspense>
  );
}
