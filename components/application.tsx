"use client";

import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Send, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ApplicationProps {
  type: "job" | "intern";
  id?: number;
  onClose: () => void;
}

const SITE_KEY = "6LfeReYrAAAAAL-1oIYBYCBs1wQ7I_x_-Rc7At8O";

const Application: React.FC<ApplicationProps> = ({ type, id, onClose }) => {
  const [formData, setFormData] = useState<{
    full_name: string;
    email: string;
    phone: string;
    resume: File | null;
    cover_letter: File | null;
  }>({
    full_name: "",
    email: "",
    phone: "",
    resume: null,
    cover_letter: null,
  });

  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, files } = e.target;
    if (!files) return;
    setFormData({ ...formData, [id]: files[0] });
  };

  const handleCaptchaChange = (value: string | null) => setCaptchaValue(value);
  const handleCaptchaExpired = () => setCaptchaValue(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captchaValue) {
      alert("Please verify that you are not a robot!");
      return;
    }

    if (!formData.resume) {
      alert("Please upload your resume.");
      return;
    }

    if (!formData.cover_letter) {
      alert("Please upload your cover letter.");
      return;
    }

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const payload = new FormData();
      payload.append("full_name", formData.full_name);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      if (formData.resume) payload.append("resume", formData.resume);
      if (formData.cover_letter) payload.append("cover_letter", formData.cover_letter);
      payload.append("recaptcha_token", captchaValue || "");
      if (type === "intern" && id) payload.append("intern", String(id));
      if (type === "job" && id) payload.append("job", String(id));

      const url =
        type === "intern"
          ? "https://app.techtrendo.com/api/app/intern-applications/"
          : "https://app.techtrendo.com/api/app/job-applications/";

      const response = await fetch(url, {
        method: "POST",
        body: payload,
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMsg("Application submitted successfully!");
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          resume: null,
          cover_letter: null,
        });
        setCaptchaValue(null);
      } else {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Unable to submit. Check your network and try again.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

      <Card className="relative z-50 max-w-lg w-full mx-4">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">
              Apply for {type === "intern" ? "Internship" : "Job"}
            </h3>
            <Button onClick={onClose}>
              <X size={24} />
            </Button>
          </div>

          {/* ✅ Success Message with Close Button */}
          {successMsg && (
            <div className="flex flex-col items-center space-y-3 bg-green-50 border border-green-200 p-4 rounded-md text-center">
              <p className="text-green-700 font-semibold">{successMsg}</p>
              <Button
                onClick={onClose}
                className="bg-green-600 hover:bg-green-700 text-white transition-all"
              >
                Close
              </Button>
            </div>
          )}

          {/* ❌ Error Message */}
          {!successMsg && errorMsg && (
            <p className="text-red-600 font-medium">{errorMsg}</p>
          )}

          {/* 📝 Form Section (only show if no success message) */}
          {!successMsg && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Full Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Row 2: Phone + Resume */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume</Label>
                  <Input
                    id="resume"
                    type="file"
                    required
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Row 3: Cover Letter */}
              <div className="space-y-2">
                <Label htmlFor="cover_letter">Cover Letter (required)</Label>
                <Input
                  id="cover_letter"
                  type="file"
                  required
                  onChange={handleFileChange}
                />
              </div>

              {/* CAPTCHA */}
              <div className="flex justify-center mt-2">
                <ReCAPTCHA
                  sitekey={SITE_KEY}
                  onChange={handleCaptchaChange}
                  onExpired={handleCaptchaExpired}
                />
              </div>

              <Button
                type="submit"
                className="btn-gradient w-full"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Application"}{" "}
                <Send className="ml-2" size={20} />
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Application;
