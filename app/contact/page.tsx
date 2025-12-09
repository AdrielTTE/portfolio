// app/contact/page.tsx
import ContactForm from '@/components/ContactForm'; // Import the new component

export default function ContactPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-extrabold text-center mb-6">Get In Touch</h1>
      <p className="text-center text-lg text-gray-600 mb-12">
        I'm currently open to new opportunities. Feel free to reach out via email or the form below!
      </p>

      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Email Me Directly</h2>
          <a 
            // 🚨 IMPORTANT: Replace with your real email address
            href="mailto:adrieltangete@gmail.com" 
            className="text-indigo-600 hover:text-indigo-800 text-xl font-medium"
          >
            adrieltangete@gmail.com
          </a>
        </div>
        
        <hr className="mb-8" />

        {/* 🚀 Insert the functional form here */}
        <h2 className="text-2xl font-bold mb-4 text-center">Send Me a Message</h2>
        <ContactForm />
      </div>
    </div>
  );
}