interface FeatureCardProps {
  title: string
  description: string
}

export default function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="w-12 h-12 sm:w-20 sm:h-20 mx-auto mb-3 bg-[#CCF7FF] rounded-lg flex items-center justify-center">
        {/* Aquí puedes agregar un ícono específico para cada feature */}
      </div>
      <h3 className="font-semibold text-black mb-1 text-md sm:text-lg">{title}</h3>
      <p className="text-xs sm:text-sm text-black/70">{description}</p>
    </div>
  )
}