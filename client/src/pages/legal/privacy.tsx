import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose dark:prose-invert">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>At Kashtex, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.</p>
          
          <h3>1. Information We Collect</h3>
          <p>We collect information you provide directly to us, such as when you fill out a contact form, request a quote, or communicate with our chatbot. This may include your name, email address, phone number, and project details.</p>
          
          <h3>2. How We Use Your Information</h3>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Send you technical notices, updates, and support messages</li>
          </ul>
          
          <h3>3. Data Security</h3>
          <p>We implement reasonable security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
          
          <h3>4. Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact us at siteveraa@gmail.com.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
