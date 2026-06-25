'use client'

import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { X, Upload, FileText, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import type { OrderFile } from '@/lib/types'

interface SubmitFilesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string
  orderTitle: string
  existingFiles: OrderFile[]
  onFilesChanged: () => void
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function SubmitFilesModal({
  open,
  onOpenChange,
  orderId,
  orderTitle,
  existingFiles,
  onFilesChanged,
}: SubmitFilesModalProps) {
  const queryClient = useQueryClient()
  const [localExistingFiles, setLocalExistingFiles] = useState<OrderFile[]>([])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync from props only when the modal opens so mid-session deletions stay reactive
  useEffect(() => {
    if (open) {
      setLocalExistingFiles(existingFiles)
      setNewFiles([])
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const isBusy = isUploading || deletingId !== null

  const handleClose = () => {
    if (isBusy) return
    onOpenChange(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFiles((prev) => [...prev, ...Array.from(e.target.files || [])])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setNewFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)])
  }

  const handleDeleteExisting = async (public_id: string) => {
    setDeletingId(public_id)
    try {
      const res = await fetch(`/api/orders/${orderId}/submit`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.message || 'Failed to remove file')
      }
      setLocalExistingFiles((prev) => prev.filter((f) => f.public_id !== public_id))
      queryClient.setQueryData(['order', orderId], (old: any) =>
        old
          ? { ...old, submitted_files: (old.submitted_files || []).filter((f: any) => f.public_id !== public_id) }
          : old
      )
      onFilesChanged()
      toast.success('File removed')
    } catch (err: any) {
      toast.error(err?.message || 'Could not remove file')
    } finally {
      setDeletingId(null)
    }
  }

  const handleUpload = async () => {
    if (newFiles.length === 0) return
    setIsUploading(true)
    try {
      const formData = new FormData()
      newFiles.forEach((f) => formData.append('files', f))
      const res = await fetch(`/api/orders/${orderId}/submit`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.message || 'Upload failed')
      }
      const data = await res.json()
      queryClient.setQueryData(['order', orderId], (old: any) =>
        old
          ? { ...old, submitted_files: data.submitted_files, status: 'completed' }
          : old
      )
      toast.success('Files submitted successfully')
      setNewFiles([])
      onFilesChanged()
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to upload files')
    } finally {
      setIsUploading(false)
    }
  }

  const isEditing = localExistingFiles.length > 0

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Submission' : 'Submit Work Files'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Manage submitted files for' : 'Upload completed work files for'}{' '}
            &ldquo;{orderTitle}&rdquo;
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Existing submitted files */}
          {localExistingFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Submitted files</p>
              <ul className="space-y-2">
                {localExistingFiles.map((file) => (
                  <li
                    key={file.public_id}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate hover:underline"
                      >
                        {file.name}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteExisting(file.public_id)}
                      disabled={isBusy}
                      className="ml-2 shrink-0 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                    >
                      {deletingId === file.public_id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isEditing && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-2 text-xs text-muted-foreground">
                  Add more files
                </span>
              </div>
            </div>
          )}

          {/* New file picker */}
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <Upload className="h-7 w-7 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-medium">Click to select files</p>
            <p className="text-xs text-muted-foreground mt-1">or drag and drop</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {newFiles.length > 0 && (
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {newFiles.map((file, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatSize(file.size)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewFiles((prev) => prev.filter((_, j) => j !== i))}
                    disabled={isUploading}
                    className="ml-2 shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isBusy}>
            {isEditing ? 'Close' : 'Cancel'}
          </Button>
          {newFiles.length > 0 && (
            <Button type="button" onClick={handleUpload} disabled={isBusy}>
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading…
                </>
              ) : (
                `Upload (${newFiles.length} file${newFiles.length > 1 ? 's' : ''})`
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
