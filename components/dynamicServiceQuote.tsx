"use client";
import dynamic from "next/dynamic";

// The quote modal (with the reCAPTCHA form) is only ever opened by user action,
// so keep it out of the initial JS bundle until it is needed.
const ServiceQuote = dynamic(() => import("@/components/ServiceQuote"), {
  ssr: false,
});

export const dynamicServiceQuote = ServiceQuote;
export default ServiceQuote;
