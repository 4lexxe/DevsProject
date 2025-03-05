import React from 'react';
import { Revenue } from '../types';
import { DollarSign, TrendingUp } from 'lucide-react';

interface RevenueChartProps {
  data: Revenue[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.amount));
  const totalRevenue = data.reduce((sum, item) => sum + item.amount, 0);
  const averageRevenue = totalRevenue / data.length;
  
  // Calculate growth percentage (comparing last month to previous month)
  const lastMonthRevenue = data[data.length - 1].amount;
  const previousMonthRevenue = data[data.length - 2].amount;
  const growthPercentage = ((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
          <select className="text-sm border-gray-300 rounded-md">
            <option>This Year</option>
            <option>Last Year</option>
            <option>Last 6 Months</option>
          </select>
        </div>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-green-100 mr-3">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-xl font-bold">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-blue-100 mr-3">
              <DollarSign size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Monthly</p>
              <p className="text-xl font-bold">${Math.round(averageRevenue).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-purple-100 mr-3">
              <TrendingUp size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Growth</p>
              <p className={`text-xl font-bold ${growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {growthPercentage >= 0 ? '+' : ''}{growthPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="h-64 flex items-end space-x-2">
          {data.map((item, index) => {
            const height = (item.amount / maxValue) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t-md hover:bg-blue-600 transition-colors relative group"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${item.amount.toLocaleString()}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{item.month}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;