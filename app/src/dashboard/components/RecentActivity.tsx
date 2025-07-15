import { User, BookOpen, Award } from 'lucide-react'

const activities = [
  {
    id: 1,
    type: 'enrollment',
    user: 'María García',
    action: 'se inscribió en',
    target: 'Curso de React Avanzado',
    time: 'hace 2 horas',
    icon: User,
  },
  {
    id: 2,
    type: 'completion',
    user: 'Carlos López',
    action: 'completó el',
    target: 'Módulo de JavaScript ES6',
    time: 'hace 4 horas',
    icon: BookOpen,
  },
  {
    id: 3,
    type: 'certificate',
    user: 'Ana Rodríguez',
    action: 'obtuvo certificación en',
    target: 'Desarrollo Web Full Stack',
    time: 'hace 1 día',
    icon: Award,
  },
  {
    id: 4,
    type: 'enrollment',
    user: 'Pedro Martínez',
    action: 'se inscribió en',
    target: 'Curso de Python',
    time: 'hace 2 días',
    icon: User,
  },
]

const RecentActivity = () => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span>{' '}
                  {activity.action}{' '}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecentActivity
