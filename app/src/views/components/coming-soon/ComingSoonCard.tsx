interface ComingSoonCardProps {
  className?: string
  imageUrl?: string
  aspectRatio?: "portrait" | "landscape" | "square"
  title?: string
}

export function ComingSoonCard({
  className = "",
  imageUrl = "https://cdn.pixabay.com/photo/2017/01/25/17/35/picture-2008484_1280.png",
  aspectRatio = "square",
  title = "Coming Soon"
}: ComingSoonCardProps) {
  const aspectRatioClasses = {
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    square: "aspect-square"
  }

  return (
    <div className={`relative overflow-hidden rounded-lg bg-card ${className}`}>
      <div className={`${aspectRatioClasses[aspectRatio]} w-full`}>
        <img
          src={imageUrl || "/placeholder.svg"}
          alt="Coming Soon"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 backdrop-blur-sm">
        <p className="text-sm font-medium text-white md:text-base">
          {title}
        </p>
      </div>
    </div>
  )
}