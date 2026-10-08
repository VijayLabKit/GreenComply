import { AlertTriangle, X } from 'lucide-react'
import { Button } from './ui'

export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel, busy = false, danger = true }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="glass-card w-full max-w-sm p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(239,83,80,0.1)', border: '1px solid rgba(239,83,80,0.25)' }}>
              <AlertTriangle size={17} className="text-danger" />
            </div>
            <h2 className="text-base font-semibold text-ink">{title}</h2>
          </div>
          <button onClick={onCancel} className="text-ink-soft hover:text-ink"><X size={18} /></button>
        </div>
        <p className="text-sm text-ink-soft leading-relaxed mb-6">{message}</p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onCancel} disabled={busy}>Cancel</Button>
          <Button variant={danger ? 'danger' : 'primary'} className="flex-1" onClick={onConfirm} disabled={busy}>
            {busy ? 'Working…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
