import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "./Button";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Label } from "./Label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { ContactMessageService } from "./services/contact.service";

import { formSchema, FormData } from "./types";

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configurar react-hook-form con zodResolver
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  // Función para manejar el envío del formulario usando el service
  const onSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await ContactMessageService.create(formData);
      toast.success("Formulario enviado con éxito!");
      reset();
    } catch (error) {
      console.error("Error al enviar el formulario.", error);
      toast.error("Error al enviar el formulario");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container animate-in">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Tu nombre"
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-offset-2"
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="tu@email.com"
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-offset-2"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Asunto</Label>
          <Input
            id="subject"
            {...register("subject")}
            placeholder="Asunto de tu mensaje"
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-offset-2"
          />
          {errors.subject && (
            <p className="text-sm text-red-500 mt-1">{errors.subject.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Mensaje</Label>
          <Textarea
            id="message"
            {...register("message")}
            placeholder="Escribe tu mensaje aquí..."
            className="min-h-[150px] w-full transition-all duration-200 focus:ring-2 focus:ring-offset-2"
          />
          {errors.message && (
            <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200"
        >
          {isSubmitting ? "Enviando..." : "Enviar mensaje"}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
