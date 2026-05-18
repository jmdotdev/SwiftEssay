'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Search, Check } from 'lucide-react'
import { useWriters } from '@/lib/hooks'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import type { Writer } from '@/lib/types'

interface AssignWriterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssign: (writer: Writer) => void
  orderTitle: string
}

export function AssignWriterModal({
  open,
  onOpenChange,
  onAssign,
  orderTitle,
}: AssignWriterModalProps) {
  const [search, setSearch] = useState('')
  const [selectedWriter, setSelectedWriter] = useState<Writer | null>(null)
  const { data: writers, isLoading } = useWriters()

  const filteredWriters = writers?.filter(
    (writer) =>
      writer.status === 'active' &&
      (writer.username.toLowerCase().includes(search.toLowerCase()) ||
        writer.email.toLowerCase().includes(search.toLowerCase()))
  )

  const handleWriterSelection = (writer: Writer) => {
    const hasActiveOrder = writer.activeOrderCount && writer.activeOrderCount > 0
    if (hasActiveOrder) {
      toast.warning(`${writer.username} already has an active order and cannot be assigned another one.`)
      return
    }

    setSelectedWriter(writer)
  }

  const handleAssign = () => {
    if (selectedWriter) {
      onAssign(selectedWriter)
      setSelectedWriter(null)
      setSearch('')
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Writer</DialogTitle>
          <DialogDescription>
            Select a writer to assign to &ldquo;{orderTitle}&rdquo;
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search writers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))
            ) : filteredWriters?.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-4">
                No writers found
              </p>
            ) : (
              filteredWriters?.map((writer) => {
                const hasActiveOrder = writer.activeOrderCount && writer.activeOrderCount > 0
                return (
                  <button
                    key={writer._id}
                    onClick={() => handleWriterSelection(writer)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                      selectedWriter?._id === writer._id
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent hover:bg-muted'
                    } ${hasActiveOrder ? 'cursor-not-allowed opacity-80' : ''}`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {writer.username.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{writer.username}</span>
                        {selectedWriter?._id === writer._id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {writer.email}
                      </p>
                    </div>
                    <Badge variant={hasActiveOrder ? 'destructive' : 'secondary'} className="shrink-0">
                      {hasActiveOrder
                        ? `${writer.activeOrderCount} active order`
                        : writer.tasksCompleted !== undefined
                        ? `${writer.tasksCompleted} completed`
                        : 'Available'}
                    </Badge>
                  </button>
                )
              })
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selectedWriter}>
            Assign Writer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
