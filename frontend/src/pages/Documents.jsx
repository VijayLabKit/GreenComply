import { useRef, useState } from 'react'
import { FileText, Download, UploadCloud, X, Loader2 } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { SectionCard, Button, Skeleton, ErrorState, FallbackBanner } from '../components/ui'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../components/Toast'
import { documents as mockDocs } from '../data/mockData'
import { useApi, downloadFile } from '../hooks/useApi'
import api from '../lib/api'

const typeColor = {
  Report:      'bg-forest-200 text-forest-500 border border-forest-300/30',
  Declaration: 'bg-amber/10 text-amber border border-amber/20',
  Evidence:    'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  Certificate: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
}

export default function Documents() {
  const toast = useToast()
  const { data, loading, error, usingFallback, retry } = useApi('/api/documents', { fallback: mockDocs })
  const [uploading, setUploading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const fileRef = useRef()

  const docs = Array.isArray(data) ? data : mockDocs

  const upload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      await api.post('/api/documents/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success(`Document "${file.name}" uploaded to the compliance vault.`)
      retry()
    } catch {
      toast.error('Upload failed — check the file size and your connection.')
    }
    setUploading(false)
    e.target.value = ''
  }

  const doDelete = async () => {
    if (!confirmDelete) return
    setDeleting(true)
    try {
      await api.delete(`/api/documents/${confirmDelete.id}`)
      toast.success(`"${confirmDelete.name}" deleted.`)
      setConfirmDelete(null)
      retry()
    } catch {
      toast.error('Could not delete the document — please retry.')
    }
    setDeleting(false)
  }

  const download = async (d) => {
    try {
      const filename = await downloadFile(`/api/documents/${d.id}/download`, d.name)
      toast.success(`Download started — ${filename}`)
    } catch {
      toast.error('Download failed — please retry.')
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Documents" subtitle="Compliance vault — reports, certificates and evidence, versioned">
        <div className="card p-5 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Documents" subtitle="Compliance vault — reports, certificates and evidence, versioned">
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.xml,.csv,.xlsx,.docx"
        className="hidden"
        onChange={upload}
        id="doc-upload-input"
      />
      {confirmDelete && (
        <ConfirmDialog
          title="Delete document"
          message={`Delete "${confirmDelete.name}" from the compliance vault? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={doDelete}
          onCancel={() => setConfirmDelete(null)}
          busy={deleting}
        />
      )}

      {usingFallback && <FallbackBanner />}
      {error && !usingFallback && <ErrorState message={error} onRetry={retry} />}

      <SectionCard
        action={
          <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />}
            {uploading ? 'Uploading…' : 'Upload document'}
          </Button>
        }
      >
        {docs.length === 0 ? (
          <div className="text-center py-16">
            <FileText size={36} className="text-ink-soft mx-auto mb-3 opacity-40" />
            <p className="text-sm text-ink-soft">No documents yet. Upload your first compliance document.</p>
          </div>
        ) : (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {docs.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between py-3.5 gap-4 group"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.2)' }}>
                    <FileText size={16} className="text-forest-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{d.name}</p>
                    <p className="text-xs text-ink-soft mt-0.5">{d.date} · {d.version}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeColor[d.type] ?? typeColor.Evidence}`}>
                    {d.type}
                  </span>
                  <button
                    onClick={() => download(d)}
                    className="text-ink-soft hover:text-forest-500 transition-colors"
                    title="Download"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(d)}
                    className="text-ink-soft hover:text-danger transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </DashboardLayout>
  )
}
