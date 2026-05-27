'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Edit, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/dashboard/data-table'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { WriterModal } from '@/components/dashboard/writer-modal'
import type { WriterFormData } from '@/lib/validations'
import { useWriters } from '@/lib/hooks'
import { toast } from 'sonner'
import type { Writer } from '@/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DeleteDialog } from '@/components/dashboard/delete-dialog'

export default function WritersPage() {
  const router = useRouter()
  const query = useQueryClient()
  const { data: writers, isLoading } = useWriters()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedWriter, setSelectedWriter] = useState<Writer | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const handleAddWriter = () => {
    setModalMode('add')
    setSelectedWriter(null)
    setModalOpen(true)
  }

  const handleEditWriter = (writer: Writer, e: React.MouseEvent) => {
    e.stopPropagation()
    setModalMode('edit')
    setSelectedWriter(writer)
    setModalOpen(true)
  }

  const handleDeleteWriter = () => {
    if (!selectedWriter) return
    deleteWriterMutation.mutate(selectedWriter._id, {
    onSuccess: async (res) => {
      toast.success(`Writer has been deleted successfully`)
      await query.invalidateQueries({ queryKey: ['writers'] })
      setDeleteModalOpen(false)
      setSelectedWriter(null)
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to delete writer')
      setDeleteModalOpen(false)
      setSelectedWriter(null)
    }
  })
  }

  const createWriterMutation = useMutation({
    mutationFn: async (data: WriterFormData) => {
      const res = await fetch('/api/writers/add', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.name,
          email: data.email,
          status: data.status,
        }),
      })
      if (!res.ok) {
        throw new Error('Failed to add writer')
      }
      return res.json()
    }
  })

  const updateWriterMutation = useMutation({
    mutationFn: async (data: { id: string; name: string; email: string; status: string }) => {
      const res = await fetch(`/api/writers/${data.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.name,
          email: data.email,
          status: data.status
        }),
      })
      if (!res.ok) {
        throw new Error('Failed to update writer')
      }
      return res.json()
    }
  })

  const deleteWriterMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/writers/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const json = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(json?.message || 'Failed to delete writer')
      }
      return json
    }
  })


  const handleSubmit = async (data: WriterFormData) => {
    if (modalMode === 'add') {
      createWriterMutation.mutate(data, {
        onSuccess: async (res) => {
          toast.success(`Writer has been added`)
          await query.invalidateQueries({ queryKey: ['writers'] })
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : 'Failed to add writer')
        }
      })
    } else {
      updateWriterMutation.mutate({ id: selectedWriter!._id, name: data.name, email: data.email, status: data.status }, {
        onSuccess: async (res) => {
          toast.success(`Writer has been updated`)
          await query.invalidateQueries({ queryKey: ['writers'] })
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : 'Failed to update writer')
        }
      })
    }
  }

  const handleRowClick = (writer: Writer) => {
    router.push(`/admin/writers/${writer._id}`)
  }

  const columns: ColumnDef<Writer>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const writer = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {writer.username.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{writer.username}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'tasksCompleted',
      header: 'Tasks Completed',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.tasksCompleted}</span>
      ),
    },
    {
      accessorKey: 'pendingTasks',
      header: 'Pending Tasks',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.pendingTasks}</span>
      ),
    },
    {
      accessorKey: 'activeOrderCount',
      header: 'Active Tasks',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.activeOrderCount}</span>
      ),
    },
    {
      accessorKey: 'inRevision',
      header: 'In Revision',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.inRevision}</span>
      ),
    },
    {
      accessorKey: 'canceledTasks',
      header: 'Canceled Tasks',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.canceledTasks ?? 0}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const writer = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className='cursor-pointer' onClick={(e) => handleEditWriter(writer, e)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedWriter(writer)
                  setDeleteModalOpen(true)
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Writers</h1>
          <p className="text-muted-foreground">
            Manage your writers and view their performance.
          </p>
        </div>
        <Button onClick={handleAddWriter} className="flex items-center cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Add Writer
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={writers ?? []}
        searchKey="name"
        searchPlaceholder="Search writers..."
        isLoading={isLoading}
        onRowClick={handleRowClick}
      />

      <WriterModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleSubmit}
        writer={selectedWriter}
        mode={modalMode}
      />
      <DeleteDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteWriter}
        title="Delete Writer"
        message={
          selectedWriter
            ? `Are you sure you want to delete ${selectedWriter.username}? This action cannot be undone.`
            : 'Are you sure you want to delete this writer? This action cannot be undone.'
        }
        confirmText="Delete Writer"
      />
    </div>
  )
}
