import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface ChartCardProps {
  title: string
  type: 'line' | 'bar'
}

const ChartCard = ({ title, type }: ChartCardProps) => {
  const lineData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Inscripciones',
        data: [65, 89, 80, 81, 96, 85],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const barData = {
    labels: ['React', 'Vue', 'Angular', 'Node.js', 'Python'],
    datasets: [
      {
        label: 'Progreso (%)',
        data: [85, 78, 92, 67, 89],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-64">
        {type === 'line' ? (
          <Line data={lineData} options={options} />
        ) : (
          <Bar data={barData} options={options} />
        )}
      </div>
    </div>
  )
}

export default ChartCard
