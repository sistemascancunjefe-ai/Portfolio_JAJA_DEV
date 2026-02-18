import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ValidadorDashboard() {
  const [validationStatus, setValidationStatus] = useState('idle');

  const validationStats = [
    { label: 'Registros Procesados', value: '24,847', icon: '📊' },
    { label: 'Errores Críticos', value: '3', icon: '🔴' },
    { label: 'Advertencias', value: '47', icon: '🟡' },
    { label: 'Tiempo Transcurrido', value: '18min', icon: '⏱️' },
  ];

  const criticalErrors = [
    { row: 1247, field: 'COSTO_UNITARIO', issue: 'Valor negativo detectado', severity: 'CRITICAL' },
    { row: 3891, field: 'FECHA_ENTREGA', issue: 'Formato de fecha inválido', severity: 'CRITICAL' },
    { row: 5632, field: 'CANTIDAD', issue: 'Excede límite máximo', severity: 'CRITICAL' },
  ];

  return (
    <div className="bg-black/90 border-2 border-orange-500/50 p-8 rounded-lg font-mono text-sm">
      <div className="flex items-center justify-between mb-6 border-b border-orange-500/30 pb-4">
        <h3 className="text-2xl font-bold text-orange-400">VALIDADOR v5.0</h3>
        <div className="flex gap-4">
          <button
            onClick={() => setValidationStatus('running')}
            className="px-4 py-2 bg-green-500/20 border border-green-500 text-green-400 hover:bg-green-500/30 transition-all"
          >
            ▶ INICIAR
          </button>
          <button
            onClick={() => setValidationStatus('idle')}
            className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 hover:bg-red-500/30 transition-all"
          >
            ⏹ DETENER
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {validationStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-900/50 border border-gray-700 p-4"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-gray-500 text-xs mb-1">{stat.label}</div>
            <div className="text-xl font-bold text-white">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      {validationStatus === 'running' && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Validando registros...</span>
            <span>87.3%</span>
          </div>
          <div className="w-full bg-gray-800 h-2">
            <motion.div
              className="bg-green-500 h-2"
              initial={{ width: '0%' }}
              animate={{ width: '87.3%' }}
              transition={{ duration: 2, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* Critical Errors Table */}
      <div className="border border-red-500/30 bg-red-500/5">
        <div className="bg-red-500/20 px-4 py-2 border-b border-red-500/30">
          <span className="text-red-400 font-bold">⚠ ERRORES CRÍTICOS</span>
        </div>
        <div className="divide-y divide-red-500/20">
          {criticalErrors.map((error, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 hover:bg-red-500/10 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-red-500 font-bold">Fila {error.row}</span>
                    <span className="text-gray-600">→</span>
                    <span className="text-gray-400">{error.field}</span>
                  </div>
                  <div className="text-gray-300 text-xs">{error.issue}</div>
                </div>
                <span className="text-xs px-2 py-1 bg-red-500/30 border border-red-500 text-red-300">
                  {error.severity}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between text-xs text-gray-600">
        <span>Reducción de tiempo: 85-90% vs manual</span>
        <span>Precisión: 99%+</span>
      </div>
    </div>
  );
}
