// EmailService.ts (backend)
import { Resend } from "resend";

const resend = new Resend(process.env.API_KEY_RESEND);

export const sendContactEmail = async (formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["hweilnuwa@gmail.com"],
    subject: `Nuevo mensaje de contacto: ${formData.subject}`,
    react: `<div>
    <h1>Welcome, ${formData.name}!</h1>
    <p><strong>Nombre: </strong> ${formData.name}</p>
    <p><strong>Email: </strong> ${formData.email}</p>
    <p><strong>Mensaje:</strong> ${formData.subject}</p>
    <p>${formData.message}</p>
  </div>`,
  });

  if (error) {
    console.error("Error enviando email con Resend:", error);
    throw error;
  }
};
