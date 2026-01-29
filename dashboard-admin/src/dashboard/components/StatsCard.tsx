import { motion } from 'framer-motion';
import FontelloIcon from '../../shared/components/icons/FontelloIcon';

interface StatsCardProps {
  title: string;
  value: string | number;
  iconName: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  iconName,
  trend,
  subtitle
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <FontelloIcon
                name={trend.isPositive ? 'icon-up' : 'icon-down'}
                className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
                fallback={
                  <svg 
                    className={`w-4 h-4 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    {trend.isPositive ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17l5-5m0 0l-5-5m5 5H6" />
                    )}
                  </svg>
                }
              />
              <span className={`text-sm font-medium ml-1 ${
                trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs mes anterior</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <FontelloIcon 
            name={iconName}
            className="text-2xl text-gray-900 dark:text-white"
            fallback={
              <div className="h-6 w-6 text-gray-900 dark:text-white">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            }
          />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
