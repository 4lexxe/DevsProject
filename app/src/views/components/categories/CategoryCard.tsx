interface CategoryCardProps {
  name: string
  icon: string
  count: number
  color: string
}

export default function CategoryCard({ name, icon, count, color }: CategoryCardProps) {
  return (
    <div 
      className="group relative aspect-square rounded-lg overflow-hidden transition-transform hover:scale-105"
      style={{ backgroundColor: color }}
    >
      <a 
        href={`/cursos/${name.toLowerCase()}`} 
        className="absolute inset-0 p-4 flex flex-col items-center justify-center text-center"
      >
        <span className="text-4xl mb-2">{icon}</span>
        <h3 className="font-semibold text-black mb-1">{name}</h3>
        <span className="text-sm text-black/70">{count} cursos</span>
      </a>
    </div>
  )
}