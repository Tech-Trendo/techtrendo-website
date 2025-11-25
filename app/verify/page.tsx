"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Certificate {
  id: string;
  certificate_no: string;
  holder_name: string;
  designation?: string; // course name or position
  type: "course" | "internship" | "employment";
  start_date: string;
  end_date: string;
  issued_date: string;
  verification_date?: string;
  status: "valid" | "expired" | "revoked" | "pending";
  issuer_company: string;
  verification_code: string;
  created_at: string;
  updated_at: string;
}

const Verify = () => {
  const [certificateCode, setCertificateCode] = useState("");
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!certificateCode.trim()) {
      setError("Please enter a certificate code");
      return;
    }

    if (!certificateCode.startsWith("TTMC")) {
      setError("Certificate code must start with 'TTMC'");
      return;
    }

    setIsLoading(true);
    setError("");
    setCertificate(null);

    try {
      const res = await fetch(
        `https://app.techtrendo.com/api/verify/certificates/verify/code/${certificateCode}`
      );

      if (!res.ok) {
        throw new Error("Certificate not found. Please check the code and try again.");
      }

      const data: Certificate = await res.json();
      setCertificate(data);
      setError("");
    } catch (err: any) {
      setCertificate(null);
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };


  const getCertificateTypeText = (cert: Certificate) => {
    switch (cert.type) {
      case "course":
        return cert.designation ? `${cert.designation} course` : "course";
      case "internship":
        return cert.designation ? `internship as ${cert.designation}` : "internship";
      case "employment":
        return cert.designation ? `employment as ${cert.designation}` : "employment";
      default:
        return cert.type;
    }
  };

  return (
    <main className="min-h-screen bg-background pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Certificate Verification
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Verify the authenticity of Tech Trendo certificates by entering the certificate code below.
            </p>
          </div>

          {/* Search Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Certificate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter certificate code (e.g., TTMC001)"
                    value={certificateCode}
                    onChange={(e) => setCertificateCode(e.target.value.toUpperCase())}
                    onKeyPress={handleKeyPress}
                    className="text-lg"
                  />
                  {error && (
                    <p className="text-destructive text-sm mt-2">{error}</p>
                  )}
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? "Searching..." : "Verify"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Certificate Display */}
          {certificate && (
            <div className="space-y-6">
              <Card className="relative p-8 bg-white border-4 border-primary shadow-lg print:border-none print:shadow-none print:p-0 overflow-hidden">
                {/* Watermark Background */}
                <div className="absolute inset-0 flex flex-wrap opacity-5 pointer-events-none">
                  {Array.from({ length: 300 }).map((_, idx) => (
                    <span
                      key={idx}
                      className="text-4xl font-bold text-gray-300 m-2 transform rotate-12"
                      style={{ flex: "0 0 auto" }}
                    >
                      Tech Trendo
                    </span>
                  ))}
                </div>

                {/* Certificate Content */}
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold text-primary mb-2">
                      Certificate of Completion
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      This certificate is proudly presented to
                    </p>
                    <h3 className="text-3xl font-bold text-foreground my-4">
                      {certificate.holder_name}
                    </h3>
                 
                    <p className="text-lg text-muted-foreground">
                      for successfully completing the
                    </p>
                    <h4 className="text-2xl font-semibold text-primary mt-2">
                      {getCertificateTypeText(certificate).toUpperCase()}
                    </h4>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-8 text-center md:text-left">
                    <div className="space-y-3">
                      <p className="font-semibold text-muted-foreground">Certificate No:</p>
                      <p className="text-lg">{certificate.certificate_no}</p>

                      <p className="font-semibold text-muted-foreground">Start Date:</p>
                      <p className="text-lg">{certificate.start_date}</p>

                      <p className="font-semibold text-muted-foreground">End Date:</p>
                      <p className="text-lg">{certificate.end_date}</p>
                    </div>
                    <div className="space-y-3">
                      <p className="font-semibold text-muted-foreground">Issued Date:</p>
                      <p className="text-lg">{certificate.issued_date}</p>

                      <p className="font-semibold text-muted-foreground">Status:</p>
                      <p className="text-lg">{certificate.status.toUpperCase()}</p>

                      <p className="font-semibold text-muted-foreground">Issuer:</p>
                      <p className="text-lg">{certificate.issuer_company}</p>
                    </div>
                  </div>
                </div>
              </Card>

             
          
            </div>
          )}

          {/* Instructions */}
          <Card className="mt-8 bg-muted/30">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-4">How to Verify:</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Enter the complete certificate code starting with "TTMC"
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  The code is case-insensitive and will be automatically formatted
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  If the certificate is valid, all details will be displayed above
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  For any issues, contact us at info@techtrendo.com
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Verify;
