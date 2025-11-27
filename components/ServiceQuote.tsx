"use client";
import { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Send, X, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Option {
  id: number;
  title: string;
}

interface QuoteFormData {
  full_name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  service: number | "";
  product: number | "";
}

interface ServiceQuoteProps {
  preselectedService?: number;
  preselectedProduct?: number;
  onClose?: () => void;
}

const SITE_KEY = "6LfeReYrAAAAAL-1oIYBYCBs1wQ7I_x_-Rc7At8O";

const ServiceQuote: React.FC<ServiceQuoteProps> = ({
  preselectedService,
  preselectedProduct,
  onClose,
}) => {
  const [services, setServices] = useState<Option[]>([]);
  const [products, setProducts] = useState<Option[]>([]);
  const [formData, setFormData] = useState<QuoteFormData>({
    full_name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    service: preselectedService || "",
    product: preselectedProduct || "",
  });
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [serviceRes, productRes] = await Promise.all([
          fetch("https://app.techtrendo.com/api/app/services/"),
          fetch("https://app.techtrendo.com/api/app/products/"),
        ]);
        const serviceData = await serviceRes.json();
        const productData = await productRes.json();
        setServices(serviceData);
        setProducts(productData);
      } catch (err) {
        console.error("Error fetching services/products:", err);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: id === "service" || id === "product" ? Number(value) : value,
    });
  };

  const handleCaptchaChange = (value: string | null) => setCaptchaValue(value);
  const handleCaptchaExpired = () => setCaptchaValue(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captchaValue) {
      alert("Please verify that you are not a robot!");
      return;
    }

    if (!formData.service && !formData.product) {
      alert("Please select either a service or a product.");
      return;
    }

    if (formData.service && formData.product) {
      alert("Please select only one: service or product.");
      return;
    }

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await fetch(
        "https://app.techtrendo.com/api/app/quotes/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, recaptcha_token: captchaValue }),
        }
      );

      const data = await response.json();

      if (response.status === 200 || response.status === 201) {
        setSuccessMsg("Quote request sent successfully!");
      } else {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Unable to submit. Check your network and try again.");
    }

    setLoading(false);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center`}>
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <Card className="relative z-50 max-w-lg w-full mx-4">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Request a Quote</h3>
            <Button onClick={onClose}>
              <X size={24} />
            </Button>
          </div>

          {successMsg ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <CheckCircle2 size={60} className="text-green-500" />
              <p className="text-green-600 font-semibold text-lg">
                {successMsg}
              </p>
              <Button
                onClick={onClose}
                className="bg-white text-primary border border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
              >
                Close
              </Button>
            </div>
          ) : (
            <>
              {errorMsg && (
                <p className="text-red-600 font-medium">{errorMsg}</p>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Full Name & Email */}
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

                {/* Phone & Company */}
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
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Service & Product */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="service">Select Service (optional)</Label>
                    <select
                      id="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">-- Select a service --</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product">Select Product (optional)</Label>
                    <select
                      id="product"
                      value={formData.product}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">-- Select a product --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message..."
                  />
                </div>

                {/* CAPTCHA */}
                <div className="flex justify-center">
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
                  {loading ? "Sending..." : "Send Request"}{" "}
                  <Send className="ml-2" size={20} />
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceQuote;
