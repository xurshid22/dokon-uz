'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { useToastStore } from '@/hooks/useToast'
import { cn } from '@/lib/utils'

const icons = {
  default: Info,
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
}

const colors = {
  default: 'border-l-blue-500',
  success: 'border-l-green-500',
  error: 'border-l-red-500',
  warning: 'border-l-yellow-500',
}

export function Toaster() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.variant || 'default']
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              className={cn(
                'pointer-events-auto flex items-start gap-3',
                'bg-white dark:bg-gray-800 rounded-2xl shadow-xl',
                'border border-gray-100 dark:border-gray-700 border-l-4 p-4 max-w-sm',
                colors[toast.variant || 'default']
              )}
            >
              <Icon className={cn(
                'w-5 h-5 mt-0.5 flex-shrink-0',
                toast.variant === 'success' ? 'text-green-500' :
                toast.variant === 'error' ? 'text-red-500' :
                toast.variant === 'warning' ? 'text-yellow-500' : 'text-blue-500'
              )} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{toast.title}</p>
                {toast.description && (
                  <p className="text-xs text-gray-500 mt-0.5">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
