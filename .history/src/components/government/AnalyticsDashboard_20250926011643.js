'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MapPin,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer 
} from 'recharts';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Badge from '../ui/Badge';

const mockAnalyticsData = {
  morbidityTrends: [
    { month: 'Jan', hypertension: 1245, diabetes: 987, respiratory: 543, cardiac: 324 },
    { month: 'Feb', hypertension: 1367, diabetes: 1123, respiratory: 678, cardiac: 456 },
    { month: 'Mar', hypertension: 1523, diabetes: 1256, respiratory: 789, cardiac: 523 },
    { month: 'Apr', hypertension: 1689, diabetes: 1389, respiratory: 856, cardiac: 612 },
    { month: 'May', hypertension: 1834, diabetes: 1498, respiratory: 923, cardiac: 689 },
    { month: 'Jun', hypertension: 1976, diabetes: 1634, respiratory: 1045, cardiac: 734 }
  ],
  regionDistribution: [
    { name: 'North India', value: 3245, percentage: 32.5 },
    { name: 'South India', value: 2876, percentage: 28.8 },
    { name: 'West India', value: 2234, percentage: 22.3 },
    { name: 'East India', value: 1643, percentage: 16.4 }
  ],
  diseaseCategories: [
    { category: 'Cardiovascular', cases: 4567, change: '+12%' },
    { category: 'Diabetes & Endocrine', cases: 3892, change: '+8%' },
    { category: 'Respiratory', cases: 2743, change: '+15%' },
    { category: 'Musculoskeletal', cases: 2156, change: '+5%' },
    { category: 'Neurological', cases: 1834, change: '+18%' },
    { category: 'Digestive', cases: 1567, change: '+3%' }
  ],
  mappingAccuracy: [
    { system: 'NAMASTE-ICD11', accuracy: 94.2, volume: 15678 },
    { system: 'ICD11-SNOMED', accuracy: 96.8, volume: 13245 },
    { system: 'NAMASTE-SNOMED', accuracy: 89.5, volume: 8756 },
    { system: 'Overall Average', accuracy: 93.5, volume: 37679 }
  ]
};

const COLORS = ['#4A90E2', '#F2994A', '#27AE60', '#E74C3C', '#9B59B6', '#F39C12'];

const timeRangeOptions = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 3 Months' },
  { value: '1y', label: 'Last Year' }
];

const regionOptions = [
  { value: 'all', label: 'All Regions' },
  { value: 'north', label: 'North India' },
  { value: 'south', label: 'South India' },
  { value: 'west', label: 'West India' },
  { value: 'east', label: 'East India' }
];

export default function GovernmentAnalytics() {
  const [data, setData] = useState(mockAnalyticsData);
  const [timeRange, setTimeRange] = useState('90d');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastUpdated(new Date());
    setLoading(false);
  };

  const exportReport = () => {
    // In real app, would generate and download report
    console.log('Exporting analytics report...');
  };

  const totalCases = data.diseaseCategories.reduce((sum, cat) => sum + cat.cases, 0);
  const avgMappingAccuracy = data.mappingAccuracy.find(m => m.system === 'Overall Average')?.accuracy || 0;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Aggregated morbidity trends and policy insights for public health planning
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="text-xs sm:text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={refreshData}
              loading={loading}
              className="flex items-center text-sm"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={exportReport} className="flex items-center text-sm" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="sm:w-48">
              <Select
                label="Time Range"
                options={timeRangeOptions}
                value={timeRange}
                onChange={setTimeRange}
              />
            </div>
            <div className="sm:w-48">
              <Select
                label="Region"
                options={regionOptions}
                value={selectedRegion}
                onChange={setSelectedRegion}
              />
            </div>
            <div className="flex items-end">
              <Badge variant="info" size="sm">
                Read-only Access
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cases</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {totalCases.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 mt-1">+12% vs last period</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mapping Accuracy</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{avgMappingAccuracy}%</p>
                  <p className="text-sm text-green-600 mt-1">+2.3% improvement</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Regions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">4</p>
                  <p className="text-sm text-gray-600 mt-1">Pan-India coverage</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disease Categories</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">6</p>
                  <p className="text-sm text-blue-600 mt-1">Major classifications</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Morbidity Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Morbidity Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.morbidityTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="hypertension" stroke="#4A90E2" strokeWidth={2} />
                  <Line type="monotone" dataKey="diabetes" stroke="#F2994A" strokeWidth={2} />
                  <Line type="monotone" dataKey="respiratory" stroke="#27AE60" strokeWidth={2} />
                  <Line type="monotone" dataKey="cardiac" stroke="#E74C3C" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Regional Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                Regional Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.regionDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.regionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disease Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                Disease Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.diseaseCategories.map((category, index) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{category.category}</h4>
                      <p className="text-sm text-gray-600">{category.cases.toLocaleString()} cases</p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={category.change.startsWith('+') ? 'success' : 'danger'}
                        size="sm"
                      >
                        {category.change}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mapping Accuracy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Code Mapping Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.mappingAccuracy.map((mapping, index) => (
                  <motion.div
                    key={mapping.system}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className={`p-4 rounded-lg border ${
                      mapping.system === 'Overall Average' 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-medium ${
                        mapping.system === 'Overall Average' ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {mapping.system}
                      </h4>
                      <Badge 
                        variant={mapping.accuracy >= 95 ? 'success' : mapping.accuracy >= 90 ? 'warning' : 'danger'}
                        size="sm"
                      >
                        {mapping.accuracy}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Volume: {mapping.volume.toLocaleString()}</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${mapping.accuracy}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Policy Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
              Policy Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Key Findings</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Cardiovascular diseases</strong> show highest prevalence with 12% increase this quarter
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>North India</strong> accounts for 32.5% of total cases, requiring focused intervention
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Code mapping accuracy</strong> improved by 2.3%, enhancing data reliability
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Recommendations</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm text-purple-800">
                      Deploy targeted <strong>prevention programs</strong> for cardiovascular health
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <p className="text-sm text-indigo-800">
                      Increase <strong>healthcare infrastructure</strong> in high-burden regions
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                      Continue <strong>NAMASTE integration</strong> to improve traditional medicine documentation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}