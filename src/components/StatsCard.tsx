import React from 'react';
import { TrendingUp, Users, Clock, Target, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface StatsCardProps {
  dealsCount: number;
  avgDiscount: number;
  recentDeals: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ dealsCount, avgDiscount, recentDeals }) => {
  const { isCompactView } = useTheme();
  const [animatedValues, setAnimatedValues] = React.useState({
    dealsCount: 0,
    avgDiscount: 0,
    recentDeals: 0
  });

  // Animate numbers on mount
  React.useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedValues({
        dealsCount: Math.floor(dealsCount * progress),
        avgDiscount: Math.floor(avgDiscount * progress),
        recentDeals: Math.floor(recentDeals * progress)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedValues({ dealsCount, avgDiscount, recentDeals });
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [dealsCount, avgDiscount, recentDeals]);

  const stats = [
    {
      icon: <Target className="w-5 h-5" />,
      label: 'Active Deals',
      value: animatedValues.dealsCount,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Avg. Discount',
      value: `${animatedValues.avgDiscount}%`,
      color: 'text-green-600',
      bg: 'bg-green-100',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Recent (24h)',
      value: animatedValues.recentDeals,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Sources',
      value: '4+',
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      gradient: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${isCompactView ? 'mb-4' : 'mb-6'}`}>
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className={`bg-white dark:bg-gray-800 rounded-xl ${isCompactView ? 'p-3' : 'p-4'} shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer group`}
        >
          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r ${stat.gradient} text-white mb-3 group-hover:scale-110 transition-transform duration-300`}>
            {stat.icon}
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {stat.value}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
          
          {/* Pulse effect for active stats */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;