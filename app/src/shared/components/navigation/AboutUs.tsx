import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Code, BookOpen, Lightbulb } from "lucide-react";

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">

            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative min-h-[600px] flex items-center justify-center"
            >
                {/* Imagen de fondo */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: "url('https://media.licdn.com/dms/image/v2/C4E1BAQFAX0CpC7mnew/company-background_10000/company-background_10000/0/1584319529701/facultad_de_ingenieria_unju_cover?e=2147483647&v=beta&t=B30SB46xfrLw2PNDe3R8_7kKy8Fl0rsWoAo5bah7gy4')",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                    }}
                >
                    {/* Overlay oscuro para mejorar legibilidad */}
                    <div className="absolute inset-0 backdrop-blur-sm"></div>
                </div>

                {/* Contenido del Hero */}
                <div className="relative z-10 container px-4 mx-auto">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="px-6 py-2 rounded-full bg-white/10 text-white text-sm font-medium inline-block mb-6 border border-white/20 backdrop-blur-sm"
                        >
                            Nuestra Comunidad
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-[2px_2px_0px_black]"
                        >
                            Impulsando el futuro del desarrollo
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="text-xl text-gray-200 leading-relaxed drop-shadow-[2px_2px_0px_black]"
                        >
                            Una comunidad de desarrolladores apasionados por la tecnología,
                            la innovación y el aprendizaje colaborativo.
                        </motion.p>
                    </div>
                </div>
            </motion.section>


            {/* Misión */}
            <section className="py-20 bg-white/50 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="space-y-6"
                        >
             

                            {/* Contenido principal con z-index más alto */}
                            <div className="relative z-10 space-y-6">
                                <div className="inline-block p-2 bg-blue-50 rounded-2xl mb-4">
                                    <h2 className="text-3xl font-bold text-blue-900">Nuestra Misión</h2>
                                </div>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Conectar personas apasionadas por la tecnología, facilitando un espacio
                                    donde el conocimiento fluye libremente y las ideas se transforman en
                                    proyectos que impactan positivamente en la sociedad.
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="flex justify-center items-center z-10"
                        >
                            <motion.img
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                src="https://i.ibb.co/dQ09SsH/logoDev2.png"
                                alt="DEVs Project Logo"
                                className="w-48 h-auto"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Valores */}
            <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7 }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h2 className="text-3xl font-bold text-blue-900 mb-4">
                            Nuestros Valores
                        </h2>
                        <p className="text-lg text-slate-600">
                            Los principios que guían nuestra comunidad y nos hacen únicos
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                title: "Colaboración",
                                description: "Trabajamos juntos para alcanzar objetivos comunes y crear soluciones innovadoras.",
                                icon: <Code className="w-8 h-8 text-blue-600" />
                            },
                            {
                                title: "Aprendizaje Continuo",
                                description: "Fomentamos el crecimiento personal y profesional a través del intercambio de conocimientos.",
                                icon: <BookOpen className="w-8 h-8 text-blue-600" />
                            },
                            {
                                title: "Innovación",
                                description: "Buscamos constantemente nuevas formas de resolver problemas y crear valor.",
                                icon: <Lightbulb className="w-8 h-8 text-blue-600" />
                            }
                        ].map((valor, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100"
                            >
                                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                                    {valor.icon}
                                </div>
                                <h3 className="text-xl font-bold text-blue-900 mb-4">{valor.title}</h3>
                                <p className="text-slate-600">{valor.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default AboutUs;