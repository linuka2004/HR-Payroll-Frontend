import { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock
} from "react-icons/fa";
import axios from "axios";

export default function ContactPage() {
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
    telephone: "",
    message: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/reviews",
        form
      );
      alert("Thank you! Your message has been sent.");
      setForm({
        fname: "",
        lname: "",
        email: "",
        telephone: "",
        message: ""
      });
    } catch (err) {
      alert("Failed to send message");
    }
  }

  return (
    <section className="w-full bg-gradient-to-b from-primary to-white text-secondary">
      {/* HERO */}
      <div className="relative h-[45vh] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/contact.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            GET IN TOUCH WITH <span className="text-cyan-400">PJ PLASTIC</span>
          </h1>
          <p className="mt-3 text-cyan-100 max-w-xl mx-auto">
            Have questions or inquiries? We’re here to help! Feel free to reach out to us using the contact form below.
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10">
        {/* LEFT INFO */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">GET IN TOUCH</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <InfoCard icon={<FaPhoneAlt />} title="Phone">
              +94 76 611 6847
            </InfoCard>

            <InfoCard icon={<FaEnvelope />} title="Email">
              pjplastic.admin@gmail.com
            </InfoCard>

            <InfoCard icon={<FaMapMarkerAlt />} title="Address">
              PJ Plastic (PVT) Ltd.,1st Stage, Nalanda Ellawala Industrial Zone, Paradise, Kuruwita, Sri Lanka
            </InfoCard>

            <InfoCard icon={<FaClock />} title="Working Hours">
              Mon – Sat : 9.00 AM – 5.00 PM
            </InfoCard>
          </div>

          {/* MAP */}
          <div className="mt-6 rounded-2xl overflow-hidden shadow-lg border">
            <iframe
              title="Store Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.047150966098!2d80.36729037475551!3d6.76410569323261!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3bd00348ec20f%3A0xd6503bc20d3b212a!2sPJ%20Plastic%20(pvt)Ltd.!5e0!3m2!1sen!2slk!4v1768371265116!5m2!1sen!2slk"
              className="w-full h-[280px]"
              loading="lazy"
            />
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-4">
            SEND US A MESSAGE
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                name="fname"
                placeholder="First Name"
                value={form.fname}
                onChange={handleChange}
                required
              />
              <Input
                name="lname"
                placeholder="Last Name"
                value={form.lname}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />

            <Input
              name="telephone"
              placeholder="Telephone"
              value={form.telephone}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              rows="4"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-accent/40 px-4 py-3
              focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-cyan-500 py-3 font-semibold
              text-secondary shadow-lg hover:bg-cyan-400 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ---------- Reusable Components ---------- */

function InfoCard({ icon, title, children }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-white/70 p-4 shadow-md">
      <div className="text-cyan-500 text-xl">{icon}</div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-secondary/80">{children}</p>
      </div>
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-accent/40 px-4 py-3
      focus:outline-none focus:ring-2 focus:ring-cyan-400"
    />
  );
}
