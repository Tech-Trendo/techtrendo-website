"use client";

import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { X, Send, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

interface SuggestTopicProps {
  isOpen: boolean;
  onClose: () => void;
}

const SITE_KEY = "6LfeReYrAAAAAL-1oIYBYCBs1wQ7I_x_-Rc7At8O";

const SuggestTopic: React.FC<SuggestTopicProps> = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("");
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleCaptchaChange = (value: string | null) => setCaptchaValue(value);
  const handleCaptchaExpired = () => setCaptchaValue(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captchaValue) {
      toast.error("Please verify that you are not a robot.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("topic", topic);
    formData.append("recaptcha_token", captchaValue);

    try {
      const response = await fetch("https://app.techtrendo.com/api/app/topic/", {
        method: "POST",
        body: formData,
      });

      if (response.status === 201) {
        toast.success("Topic suggestion submitted successfully!");
        setSubmitted(true);
        setFullName("");
        setEmail("");
        setPhone("");
        setTopic("");
        setCaptchaValue(null);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to submit topic.");
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
              {submitted ? "Success!" : "Suggest a Topic"}
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
                Your topic suggestion has been submitted successfully! 🎉
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
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
                {loading ? "Submitting..." : "Submit Topic"}{" "}
                <Send className="ml-2" size={20} />
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SuggestTopic;
