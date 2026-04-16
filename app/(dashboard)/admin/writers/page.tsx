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
import { useQueryClient } from '@tanstack/react-query'

export default function WritersPage() {
  const router = useRouter()
  const query = useQueryClient()
  const { data: writers, isLoading } = useWriters()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedWriter, setSelectedWriter] = useState<Writer | null>(null)

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

  const handleDeleteWriter = (writer: Writer, e: React.MouseEvent) => {
    e.stopPropagation()
    toast.success(`Writer "${writer.username}" has been deleted`)
  }

  const handleSubmit = async (data: WriterFormData) => {
    if (modalMode === 'add') {
       await fetch('/api/writers/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Credentials: 'include'
        },
        body: JSON.stringify({
          username: data.name,
          email: data.email,
          status: data.status,
        }),
      }).then(async (res) => {
        if (!res.ok) {
          throw new Error('Failed to add writer')
        }
        toast.success(`Writer "${data.name}" has been added`)
        await query.invalidateQueries({ queryKey: ['writers'] })
      }) 
    } else {
      toast.success(`Writer "${data.name}" has been updated`)
      await query.invalidateQueries({ queryKey: ['writers'] })
    }
  }

  const handleRowClick = (writer: Writer) => {
    router.push(`/admin/writers/${writer.id}`)
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
              <DropdownMenuItem onClick={(e) => handleEditWriter(writer, e)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={(e) => handleDeleteWriter(writer, e)}
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
        <Button onClick={handleAddWriter}>
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
    </div>
  )
}
