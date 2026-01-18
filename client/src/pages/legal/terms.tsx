import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <div className="prose dark:prose-invert">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h3>1. Agreement to Terms</h3>
          <p>By accessing our website, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          
          <h3>2. Services</h3>
          <p>Kashtex provides web development and design services. Specific deliverables, timelines, and costs will be outlined in a separate agreement or quote for each project.</p>
          
          <h3>3. Intellectual Property</h3>
          <p>Upon full payment, the intellectual property rights of the developed website and code are transferred to the client, unless otherwise specified in the project agreement.</p>
          
          <h3>4. Limitation of Liability</h3>
          <p>Kashtex shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.</p>
          
          <h3>5. Changes to Terms</h3>
          <p>We reserve the right to modify these terms at any time. We will provide notice of significant changes.</p>
          
          <h3>6. Contact</h3>
          <p>For any questions regarding these terms, please contact us at siteveraa@gmail.com.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
