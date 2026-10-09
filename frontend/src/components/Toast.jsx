import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const styles = {
  success: { icon: CheckCircle2, color: '#4CAF50' },
  error:   { icon: AlertTriangle, color: '#EF5350' },
  info:    { icon: Info, color: '#66BB6A' },
}

let nextId = 1

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const toast = useCallback((message, type = 'success', duration = 3500) => {
    const id = nextId++
    setToasts((prev) => [...prev.slice(-3), { id, message, type }])
    timers.current[id] = setTimeout(() => dismiss(id), duration)
    return id
  }, [dismiss])

  const apiValue = {
    toast,
    success: (m) => toast(m, 'success'),
    error: (m) => toast(m, 'error', 5000),
    info: (m) => toast(m, 'info'),
  }

  return (
    <ToastContext.Provider value={apiValue}>
      {children}
      <div className="fixed top-4 right-4 z-[100] space-y-2 w-80 max-w-[calc(100vw-2rem)]">
        {toasts.map((t) => {
          const { icon: Icon, color } = styles[t.type] ?? styles.info
          return (
            <div
              key={t.id}
              className="glass-popover flex items-start gap-3 p-3.5 animate-slide-up"
              style={{ borderLeft: `3px solid ${color}` }}
              role="status"
            >
              <Icon size={17} style={{ color }} className="shrink-0 mt-0.5" />
              <p className="text-sm text-ink flex-1 leading-snug">{t.message}</p>
              <button onClick={() => dismiss(t.id)} className="text-ink-soft hover:text-ink shrink-0">
                <X size={15} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
