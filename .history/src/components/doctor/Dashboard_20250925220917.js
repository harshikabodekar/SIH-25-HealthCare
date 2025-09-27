'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MapPin, 
  Activity, 
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Calendar
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../ui/Card';
import Badge from '../../ui/Badge';
import { formatDateTime } from '@/lib/utils';

const mockData = {
  stats: {
    totalPatients: 247,
    mappingsToday: 23,
    activeCases: 15,
    pendingReviews: 8,
  },
  recentActivity: [
    {
      id: 1,
      type: 'mapping',
      patient: 'Rajesh Kumar',
      action: 'NAMASTE code mapped to ICD-11',
      confidence: 95,
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    },
    {
      id: 2,
      type: 'patient',
      patient: 'Priya Sharma',
      action: 'New patient record created',
      confidence: null,
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    },
    {
      id: 3,
      type: 'audit',
      patient: 'Amit Singh',
      action: 'Mapping audit completed',
      confidence: 87,
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    },
  ],
  mappingHistory: [
    { date: '2024-01-15', count: 12, accuracy: 94 },
    { date: '2024-01-14', count: 18, accuracy: 91 },
    { date: '2024-01-13', count: 15, accuracy: 96 },
    { date: '2024-01-12', count: 8, accuracy: 89 },
    { date: '2024-01-11', count: 22, accuracy: 93 },
  ],
};

export default function DoctorDashboard() {
  const [data, setData] = useState(mockData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const stats = [
    {
      title: 'Total Patients',
      value: data.stats.totalPatients,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Mappings Today',
      value: data.stats.mappingsToday,
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+8%',
      changeType: 'positive',
    },
    {
      title: 'Active Cases',
      value: data.stats.activeCases,
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '-5%',
      changeType: 'negative',
    },
    {
      title: 'Pending Reviews',
      value: data.stats.pendingReviews,
      icon: Clock,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      change: '+3',
      changeType: 'neutral',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your overview for today.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        <span className={`text-sm font-medium ${
                          stat.changeType === 'positive' ? 'text-green-600' :
                          stat.changeType === 'negative' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">vs last week</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-2 rounded-full ${
                      activity.type === 'mapping' ? 'bg-blue-100' :
                      activity.type === 'patient' ? 'bg-green-100' :
                      'bg-orange-100'
                    }`}>
                      {activity.type === 'mapping' ? (
                        <MapPin className="w-4 h-4 text-blue-600" />
                      ) : activity.type === 'patient' ? (
                        <Users className="w-4 h-4 text-green-600" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.patient}
                      </p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <p className="text-xs text-gray-500">
                          {formatDateTime(activity.timestamp)}
                        </p>
                        {activity.confidence && (
                          <Badge variant="primary" size="xs">
                            {activity.confidence}% confidence
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mapping Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Mapping Performance (Last 5 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.mappingHistory.map((day, index) => (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-xs text-gray-500">{day.count} mappings</p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={day.accuracy >= 95 ? 'success' : day.accuracy >= 90 ? 'warning' : 'danger'}
                        size="sm"
                      >
                        {day.accuracy}% accuracy
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 text-blue-600 mr-2" />
                  <p className="text-sm text-blue-800">
                    Average accuracy: <span className="font-semibold">92.6%</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}