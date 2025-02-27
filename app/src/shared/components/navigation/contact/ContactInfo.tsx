import ContactForm from "./ContactForm";
import { RiContactsFill } from "react-icons/ri";

const ContactInfo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div className="text-left">
            <h1 className="text-4xl font-semibold text-gray-900 mb-4">Contáctanos</h1>
            <p className="text-lg text-gray-600 mb-6">
              ¿Tienes alguna pregunta o problema? Estamos aquí para ayudarte.
            </p>
            <RiContactsFill />
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;