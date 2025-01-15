import ActionButton from '../buttons/ActionButton';

export default function HeroContent() {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="mb-2 text-4xl font-bold text-black">
        Tu Plataforma Para Crecer Como Estudiante
      </h1>
      <h2 className="mb-4 text-2xl text-[#00D7FF]">
        De Estudiante a Profesional
      </h2>
      <p className="mb-8 text-black/80">
        Organiza tus materias, comparte apuntes con la comunidad y sigue nuestra 
        guía definitiva para convertirte en un profesional demandado en el mercado laboral.
      </p>
      <ActionButton>
        Empieza Tu Camino
      </ActionButton>
    </div>
  );
}