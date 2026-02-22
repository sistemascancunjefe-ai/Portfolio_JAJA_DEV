import { useState } from 'react';
import { motion } from 'framer-motion';

interface Route {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'delayed';
  stops: number;
  progress: number;
}

export default function RouteMap() {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const routes: Route[] = [
    { id: 'R-001', name: 'Ruta Centro', status: 'active', stops: 12, progress: 45 },
    { id: 'R-002', name: 'Ruta Norte', status: 'active', stops: 8, progress: 78 },
    { id: 'R-003', name: 'Ruta Sur', status: 'completed', stops: 15, progress: 100 },
    { id: 'R-004', name: 'Ruta Hotel Zone', status: 'delayed', stops: 10, progress: 23 },
  ];

  const getStatusColor = (status: Route['status']) => {
    switch (status) {
      case 'active': return 'text-green-400 border-green-500';
      case 'completed': return 'text-blue-400 border-blue-500';
      case 'delayed': return 'text-red-400 border-red-500';
    }
  };

  const getStatusIcon = (status: Route['status']) => {
    switch (status) {
      case 'active': return '🚍';
      case 'completed': return '✅';
      case 'delayed': return '⚠️';
    }
  };

  return (
    <div className="bg-black/90 border-2 border-purple-500/50 p-8 rounded-lg font-mono text-sm">
      <div className="flex items-center justify-between mb-6 border-b border-purple-500/30 pb-4">
        <h3 className="text-2xl font-bold text-purple-400">MAPA DE RUTAS</h3>
        <div className="text-xs text-gray-500">
          MueveCancún | Sistema de Transporte
        </div>
      </div>

      {/* Map Mockup */}
      <div className="relative bg-gray-900 border border-purple-500/30 mb-6 h-64 overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-8 h-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-purple-500/20"></div>
            ))}
          </div>
        </div>

        {/* Route visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-purple-400/50 text-6xl">🗺️</div>
        </div>

        {/* Route markers */}
        {routes.map((route, index) => (
          <motion.div
            key={route.id}
            className={`absolute w-4 h-4 rounded-full ${
              selectedRoute === route.id ? 'scale-150' : ''
            } transition-transform cursor-pointer`}
            style={{
              left: `${20 + index * 20}%`,
              top: `${30 + (index % 2) * 30}%`,
              backgroundColor: route.status === 'active' ? '#10b981' : 
                              route.status === 'completed' ? '#3b82f6' : '#ef4444'
            }}
            onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}
            animate={{
              scale: selectedRoute === route.id ? [1, 1.2, 1] : 1,
            }}
            transition={{
              repeat: selectedRoute === route.id ? Infinity : 0,
              duration: 1,
            }}
          />
        ))}
      </div>

      {/* Routes List */}
      <div className="space-y-2">
        {routes.map((route, index) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}
            className={`border p-3 cursor-pointer transition-all ${
              selectedRoute === route.id
                ? `${getStatusColor(route.status)} bg-opacity-10`
                : 'border-gray-700 hover:border-purple-500/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-xl">{getStatusIcon(route.status)}</span>
                <div>
                  <div className="font-bold text-white">{route.id}</div>
                  <div className="text-xs text-gray-400">{route.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Paradas</div>
                <div className="font-bold text-white">{route.stops}</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progreso</span>
                <span>{route.progress}%</span>
              </div>
              <div className="w-full bg-gray-800 h-1.5">
                <div
                  className={`h-1.5 transition-all ${
                    route.status === 'active' ? 'bg-green-500' :
                    route.status === 'completed' ? 'bg-blue-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${route.progress}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between text-xs text-gray-600">
        <span>Actualización en tiempo real</span>
        <span>GPS Tracking activo</span>
      </div>
    </div>
  );
}
