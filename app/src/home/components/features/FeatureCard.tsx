interface FeatureCardProps {
  title: string
  description: string
}

export default function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 bg-[#CCF7FF] rounded-lg flex items-center justify-center">
        {/* Aquí puedes agregar un ícono específico para cada feature */}
      </div>
      <h3 className="font-semibold text-black mb-2 text-lg sm:text-xl">{title}</h3>
      <p className="text-sm sm:text-base text-black/70">{description}</p>
    </div>
  )
}