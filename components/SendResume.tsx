"use client";

import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { X, Send, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

interface SendResumeProps {
  isOpen: boolean;
  onClose: () => void;
}

const SITE_KEY = "6LfeReYrAAAAAL-1oIYBYCBs1wQ7I_x_-Rc7At8O";

const SendResume: React.FC<SendResumeProps> = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleCaptchaChange = (value: string | null) => setCaptchaValue(value);
  const handleCaptchaExpired = () => setCaptchaValue(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!resumeFile) {
      toast.error("Please upload your resume.");
      return;
    }

    if (!captchaValue) {
      toast.error("Please verify that you are not a robot.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("designation", designation);
    formData.append("resume", resumeFile);
    formData.append("recaptcha_token", captchaValue);

    try {
      const response = await fetch("https://app.techtrendo.com/api/app/send-resume/", {
        method: "POST",
        body: formData,
      });

      if (response.status === 201) {
        toast.success("Resume submitted successfully!");
        setSubmitted(true);
        setFullName("");
        setEmail("");
        setPhone("");
        setDesignation("");
        setResumeFile(null);
        setCaptchaValue(null);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to submit resume.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <Card className="relative z-50 max-w-lg w-full mx-4 rounded-2xl shadow-lg">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">
              {submitted ? "Success!" : "Submit Your Resume"}
            </h3>
            <Button onClick={onClose}>
              <X size={24} />
            </Button>
          </div>

          {/* Success Message */}
          {submitted ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <CheckCircle2 className="text-green-600" size={60} />
              <p className="text-lg font-semibold text-center">
                Your resume has been submitted successfully! 🎉
              </p>
              <Button onClick={onClose} className="btn-gradient mt-4">
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Eg. Frontend Developer, Designer"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume">Upload Resume</Label>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                />
              </div>

              <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey={SITE_KEY}
                  onChange={handleCaptchaChange}
                  onExpired={handleCaptchaExpired}
                />
              </div>

              <Button type="submit" className="btn-gradient w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Resume"}{" "}
                <Send className="ml-2" size={20} />
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SendResume;
