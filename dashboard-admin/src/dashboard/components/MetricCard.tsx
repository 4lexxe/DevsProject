import { motion } from 'framer-motion';
import FontelloIcon from '../../shared/components/icons/FontelloIcon';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  icon?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  icon
}) => {

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
        {icon && (
          <div className="p-2">
            <FontelloIcon
              name={icon}
              className="text-base text-gray-900 dark:text-white"
              fallback={
                <svg className="w-4 h-4 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
      {change && (
        <div className="flex items-center gap-1 text-xs">
          <FontelloIcon
            name={change.isPositive ? 'icon-up' : 'icon-down'}
            className={`text-xs ${change.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
            fallback={
              <svg 
                className={`w-3 h-3 ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {change.isPositive ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17l5-5m0 0l-5-5m5 5H6" />
                )}
              </svg>
            }
          />
          <span className={change.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
            {Math.abs(change.value)}%
          </span>
          <span className="text-gray-500 dark:text-gray-400">vs {change.period}</span>
        </div>
      )}
    </motion.div>
  );
};

export default MetricCard;
