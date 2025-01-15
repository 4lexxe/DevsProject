import { Clock, BarChart, User } from 'lucide-react'

interface CourseCardProps {
  title: string
  description: string
  instructor: string
  level: string
  duration: string
  price: number
  image: string
}

export default function CourseCard({
  title,
  description,
  instructor,
  level,
  duration,
  price,
  image
}: CourseCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-black">{title}</h3>
        <p className="text-black/70 mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center mb-4 text-sm text-black/60">
          <User className="w-4 h-4 mr-1" />
          {instructor}
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-black/60">
            <BarChart className="w-4 h-4 mr-1" />
            {level}
          </div>
          <div className="flex items-center text-sm text-black/60">
            <Clock className="w-4 h-4 mr-1" />
            {duration}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-[#00D7FF]">
            ${price}
          </span>
          <button className="px-4 py-2 bg-[#00D7FF] text-black rounded-md hover:bg-[#66E7FF] transition-colors duration-200">
            Ver Curso
          </button>
        </div>
      </div>
    </div>
  )
}