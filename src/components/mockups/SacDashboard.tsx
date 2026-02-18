import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SacDashboard() {
  const [selectedModule, setSelectedModule] = useState('Monitor');

  const modules = [
    { name: 'Monitor', status: 'ONLINE', requests: '1,247' },
    { name: 'Validator', status: 'ONLINE', processed: '95.3%' },
    { name: 'Reporter', status: 'ONLINE', generated: '384' },
    { name: 'Alerter', status: 'ONLINE', alerts: '12' },
    { name: 'Analyzer', status: 'ONLINE', insights: '47' },
  ];

  const metrics = [
    { label: 'Uptime', value: '99.97%', color: 'text-green-400' },
    { label: 'ROI Actual', value: '3,411%', color: 'text-blue-400' },
    { label: 'Ahorro Anual', value: '5.1M MXN', color: 'text-orange-400' },
    { label: 'Procesos Automatizados', value: '127', color: 'text-purple-400' },
  ];

  return (
    <div className="bg-black/90 border-2 border-blue-500/50 p-8 rounded-lg font-mono text-sm">
      <div className="flex items-center justify-between mb-6 border-b border-blue-500/30 pb-4">
        <h3 className="text-2xl font-bold text-blue-400">SAC DASHBOARD</h3>
        <div className="flex gap-2 items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-500 text-xs">SYSTEM OPERATIONAL</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-900/50 border border-gray-700 p-4"
          >
            <div className="text-gray-500 text-xs mb-1">{metric.label}</div>
            <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Modules */}
      <div className="space-y-2">
        <div className="text-gray-500 text-xs mb-2">ACTIVE MODULES</div>
        {modules.map((module, index) => (
          <motion.div
            key={module.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedModule(module.name)}
            className={`flex items-center justify-between p-3 border cursor-pointer transition-all ${
              selectedModule === module.name
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 bg-gray-900/30 hover:border-blue-500/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-white">{module.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-xs">
                {Object.entries(module).find(([key]) => !['name', 'status'].includes(key))?.[1]}
              </span>
              <span className="text-green-500 text-xs">{module.status}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between text-xs text-gray-600">
        <span>Last Updated: {new Date().toLocaleTimeString()}</span>
        <span>v5.0.0</span>
      </div>
    </div>
  );
}
