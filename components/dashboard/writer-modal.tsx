'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { writerSchema, type WriterFormData } from '@/lib/validations'
import type { Writer } from '@/lib/types'

interface WriterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: WriterFormData) => void
  writer?: Writer | null
  mode: 'add' | 'edit'
}

export type { WriterFormData }

export function WriterModal({
  open,
  onOpenChange,
  onSubmit,
  writer,
  mode,
}: WriterModalProps) {
  const form = useForm<WriterFormData>({
    resolver: zodResolver(writerSchema),
    defaultValues: {
      name: '',
      email: '',
      status: 'active',
    },
  })

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && writer) {
        form.reset({
          name: writer.name,
          email: writer.email,
          status: writer.status,
        })
      } else {
        form.reset({
          name: '',
          email: '',
          status: 'active',
        })
      }
    }
  }, [mode, writer, open, form])

  const handleSubmit = async (data: WriterFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {mode === 'add' ? 'Add New Writer' : 'Edit Writer'}
              </DialogTitle>
              <DialogDescription>
                {mode === 'add'
                  ? 'Add a new writer to your team.'
                  : 'Update the writer&apos;s information.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter writer's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Spinner className="mr-2" />}
                {mode === 'add' ? 'Add Writer' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
