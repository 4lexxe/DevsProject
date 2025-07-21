import { BookOpen, Briefcase } from "lucide-react"

interface ComingSoonCardProps {
  className?: string
  imageUrl?: string
  aspectRatio?: "portrait" | "landscape" | "square"
  title: string
  category: string
  careerType: string
}

export function ComingSoonCard({
  className = "",
  imageUrl = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070",
  aspectRatio = "square",
  title,
  category,
  careerType
}: ComingSoonCardProps) {
  const aspectRatioClasses = {
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    square: "aspect-square"
  }

  return (
    <div className={`relative overflow-hidden rounded-lg bg-card group ${className}`}>
      <div className={`${aspectRatioClasses[aspectRatio]} w-full h-full`}>
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex flex-wrap gap-3 mb-3 text-gray-300 text-sm">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span className="opacity-90">{category}</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="w-4 h-4" />
            <span className="opacity-90">{careerType}</span>
          </div>
        </div>
        <h3 className="text-lg font-medium leading-tight">
          {title}
        </h3>
        <p className="text-sm mt-2">En desarrollo</p>
      </div>
    </div>
  )
}