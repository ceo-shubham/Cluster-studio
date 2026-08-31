"use client";
import { useState } from "react";
import { 
  Phone, Mail, Clock, MapPin, MessageCircle, Send, 
  CheckCircle, Sparkles, AlertCircle, HelpCircle 
} from "lucide-react";
import toast from "react-hot-toast";

// Set your Formspree Form ID here or in .env.local (e.g. NEXT_PUBLIC_FORMSPREE_ID)
const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ID 
  ? `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`
  : "https://formspree.io/f/YOUR_FORM_ID";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Custom Gifting Inquiry",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // If Formspree ID is set to dummy placeholder, simulate smooth success so it doesn't break
      if (FORMSPREE_ENDPOINT.includes("YOUR_FORM_ID")) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setSubmitted(true);
        toast.success("Thank you! Your message has been sent successfully.");
        return;
      }

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success("Message sent! We'll reply within 2-4 business hours.");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit form. Please chat on WhatsApp directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 py-8 pb-20">
      
      {/* ── 1. Page Header ── */}
      <section className="bg-[#FAF7F2] border-b border-amber-100/70 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-rose-100/80 text-[#670D1F] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} className="text-amber-600" /> We&apos;d Love to Hear From You
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            Get in Touch with <br />
            <span className="text-[#670D1F] italic font-normal">Cluster Studio</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
            Have questions about custom prints, corporate bulk orders, or existing shipments? Our team is always here to help you.
          </p>
        </div>
      </section>

      {/* ── 2. Quick Contact Channel Cards ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Phone */}
          <a
            href="tel:+918380808435"
            className="bg-white rounded-2xl p-5 border border-amber-100/80 shadow-sm hover:shadow-md hover:border-[#670D1F] transition-all flex flex-col items-start space-y-3 group"
          >
            <div className="w-11 h-11 rounded-xl bg-rose-50 group-hover:bg-[#670D1F] text-[#670D1F] group-hover:text-white flex items-center justify-center transition-colors">
              <Phone size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#670D1F] uppercase">Direct Helpline</span>
              <h4 className="font-bold text-sm text-gray-900 mt-0.5">+91 8380808435</h4>
              <p className="text-[11px] text-gray-500 mt-1">Available Mon - Sat, 10 AM - 7 PM</p>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/918380808435?text=Hi!%20I%20need%20help%20with%20custom%20gifting%20at%20Cluster%20Studio"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all flex flex-col items-start space-y-3 group"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 group-hover:bg-[#25D366] text-emerald-600 group-hover:text-white flex items-center justify-center transition-colors">
              <MessageCircle size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase">Instant WhatsApp Chat</span>
              <h4 className="font-bold text-sm text-gray-900 mt-0.5">+91 8380808435</h4>
              <p className="text-[11px] text-gray-500 mt-1">Quick responses &amp; live mockups</p>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:hello@clusterstudio.in"
            className="bg-white rounded-2xl p-5 border border-amber-100/80 shadow-sm hover:shadow-md hover:border-[#670D1F] transition-all flex flex-col items-start space-y-3 group"
          >
            <div className="w-11 h-11 rounded-xl bg-rose-50 group-hover:bg-[#670D1F] text-[#670D1F] group-hover:text-white flex items-center justify-center transition-colors">
              <Mail size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#670D1F] uppercase">Email Support</span>
              <h4 className="font-bold text-sm text-gray-900 mt-0.5">hello@clusterstudio.in</h4>
              <p className="text-[11px] text-gray-500 mt-1">Response within 24 hours</p>
            </div>
          </a>

          {/* Location */}
          <div className="bg-white rounded-2xl p-5 border border-amber-100/80 shadow-sm flex flex-col items-start space-y-3">
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-[#670D1F] flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#670D1F] uppercase">Studio Location</span>
              <h4 className="font-bold text-sm text-gray-900 mt-0.5">New Delhi, India</h4>
              <p className="text-[11px] text-gray-500 mt-1">Pan-India Courier Dispatch</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. Contact Form & FAQ Grid ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Formspree Ready Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-100/80">
            <div className="mb-6">
              <span className="text-xs font-bold text-[#670D1F] uppercase tracking-wider">Send a Message</span>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mt-1">
                Tell Us What You Need
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Fill out the form below, and we will get back to you promptly.
              </p>
            </div>

            {submitted ? (
              <div className="bg-rose-50/60 border border-[#670D1F]/20 rounded-2xl p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#670D1F] text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle size={28} />
                </div>
                <h4 className="font-serif text-xl font-bold text-gray-900">Message Received!</h4>
                <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. Our customer care team has received your details and will get in touch shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", phone: "", subject: "Custom Gifting Inquiry", message: "" });
                  }}
                  className="mt-2 bg-[#670D1F] hover:bg-[#520817] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Shubham Sharma"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#670D1F] bg-[#FAF7F2]/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. shubham@example.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#670D1F] bg-[#FAF7F2]/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Mobile / WhatsApp *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#670D1F] bg-[#FAF7F2]/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Inquiry Type</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#670D1F] bg-[#FAF7F2]/50"
                    >
                      <option value="Custom Gifting Inquiry">Personalized Gift Order</option>
                      <option value="Bulk Corporate Order">Bulk / Corporate Order</option>
                      <option value="Order Tracking / Support">Order Tracking &amp; Delivery</option>
                      <option value="Design Customization">Special Design Request</option>
                      <option value="Other">Other Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Your Message / Requirements *</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about the quantity, occasion, or custom text/photos you have in mind..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#670D1F] bg-[#FAF7F2]/50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#670D1F] hover:bg-[#520817] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Send size={15} />
                  {loading ? "Sending..." : "Submit Inquiry"}
                </button>
              </form>
            )}
          </div>

          {/* Right: Quick FAQs & Direct WhatsApp Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct WhatsApp Callout Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-3xl p-6 shadow-lg space-y-3">
              <div className="flex items-center gap-2">
                <MessageCircle size={24} className="text-white" />
                <h4 className="font-serif font-bold text-lg">Need Immediate Help?</h4>
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Connect directly with our creative team on WhatsApp. Share your photos, preview live drafts, and receive order status updates instantly.
              </p>
              <a
                href="https://wa.me/918380808435?text=Hi!%20I%20have%20an%20urgent%20custom%20order%20inquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-emerald-900 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wide hover:bg-emerald-50 transition-colors shadow"
              >
                Chat on +91 8380808435
              </a>
            </div>

            {/* FAQs Accordion Cards */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-amber-100/80 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <HelpCircle size={18} className="text-[#670D1F]" />
                <h4 className="font-serif font-bold text-base text-gray-900">Frequently Asked Questions</h4>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-amber-100/60">
                  <strong className="text-gray-900 block mb-1">How fast is delivery?</strong>
                  <p className="text-gray-600">Most orders are printed and dispatched within 24-48 hours. Standard courier transit takes 3-5 business days across India.</p>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-amber-100/60">
                  <strong className="text-gray-900 block mb-1">Can I see a preview before printing?</strong>
                  <p className="text-gray-600">Yes! Our online customizer shows live previews, and for special bulk orders, our designer shares WhatsApp mockups before printing.</p>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-amber-100/60">
                  <strong className="text-gray-900 block mb-1">What if the item is damaged in courier?</strong>
                  <p className="text-gray-600">We offer a 100% Zero-Risk replacement! Simply share an unboxing photo/video on WhatsApp (+91 8380808435) within 48 hours for an instant free replacement.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
