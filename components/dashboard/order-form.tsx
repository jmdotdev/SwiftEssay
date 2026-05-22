'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, X, FileText, Image, File } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'
import { createOrderSchema, type CreateOrderFormData } from '@/lib/validations'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  file?: File
}

interface ExistingFile {
  url: string
  public_id: string
  name: string
}

interface OrderFormProps {
  initialData?: {
    id?: string
    title: string
    description: string
    discipline: string
    totalPrice: number
    price_per_page: number
    total_pages: number
    deadline: string
    files?: ExistingFile[]
  }
  isEditing?: boolean
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) {
    return <Image className="h-5 w-5 text-blue-500" />
  }
  if (type === 'application/pdf' || type.includes('document')) {
    return <FileText className="h-5 w-5 text-red-500" />
  }
  return <File className="h-5 w-5 text-muted-foreground" />
}

export function OrderForm({ initialData, isEditing = false }: OrderFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(
    initialData?.files?.map((file) => ({
      id: file.public_id,
      name: file.name,
      size: 0,
      type: 'existing',
    })) || []
  )
  const [removedFileIds, setRemovedFileIds] = useState<string[]>([])

  const form = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      discipline: '',
      totalPrice: 0,
      price_per_page: 0,
      total_pages: 0,
      files: [],
      deadline: '',
    },
  })

  // Auto-calculate total price
  useEffect(() => {
    const pricePerPage = form.watch('price_per_page')
    const totalPages = form.watch('total_pages')
    const calculatedPrice = pricePerPage * totalPages
    form.setValue('totalPrice', Math.round(calculatedPrice * 100) / 100)
  }, [form.watch('price_per_page'), form.watch('total_pages'), form])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      file,
    }))

    setUploadedFiles((prev) => {
      const combined = [...prev, ...newFiles]
      form.setValue('files', combined as any)
      return combined
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => {
      const nextFiles = prev.filter((f) => f.id !== id)
      form.setValue('files', nextFiles as any)
      
      // Track if it's an existing file being removed
      const fileToRemove = prev.find((f) => f.id === id)
      if (fileToRemove?.type === 'existing') {
        setRemovedFileIds((prev) => [...prev, id])
      }
      
      return nextFiles
    })
  }

  const onSubmit = async (data: CreateOrderFormData) => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('discipline', data.discipline)
    formData.append('description', data.description)
    formData.append('totalPrice', data.totalPrice.toString())
    formData.append('price_per_page', data.price_per_page.toString())
    formData.append('total_pages', data.total_pages.toString())
    formData.append('deadline', data.deadline)

    // Send existing file IDs to keep and removed file IDs
    const existingFileIds = uploadedFiles
      .filter((file) => file.type === 'existing')
      .map((file) => file.id)
    formData.append('existingFileIds', JSON.stringify(existingFileIds))
    formData.append('removedFileIds', JSON.stringify(removedFileIds))

    // Only append new files (those with a File object)
    uploadedFiles.forEach((file) => {
      if (file.file) {
        formData.append('files', file.file)
      }
    })

    try {
      const url = isEditing && initialData?.id 
        ? `/api/orders/${initialData.id}` 
        : '/api/orders/create'
      
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: formData,
      })

      if (response.ok) {
        const message = isEditing ? 'Order updated successfully' : 'Order created successfully'
        toast.success(message)
        router.push('/admin/orders')
      } else {
        const error = await response.json()
        toast.error(error.message || `Failed to ${isEditing ? 'update' : 'create'} order`)
      }
    } catch (error) {
      toast.error(`An error occurred while ${isEditing ? 'updating' : 'creating'} the order`)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (!files) return

    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      file,
    }))

    setUploadedFiles((prev) => {
      const combined = [...prev, ...newFiles]
      form.setValue('files', combined as any)
      return combined
    })
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/admin/orders">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {isEditing ? 'Edit Order' : 'Create New Order'}
        </h1>
        <p className="text-muted-foreground">
          {isEditing
            ? 'Update the order details below.'
            : 'Fill in the details below to create a new order.'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                  <CardDescription>
                    Basic information about the order
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter order title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discipline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discipline</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter discipline or subject" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter detailed description and requirements"
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>File Attachments</CardTitle>
                  <CardDescription>
                    Upload reference materials, guidelines, or any relevant files
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="files"
                    render={() => (
                      <FormItem>
                        <div
                          className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.txt,.rtf,.odt,.jpg,.jpeg,.png,.gif,.webp"
                          />
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                              <Upload className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">Click to upload or drag and drop</p>
                              <p className="text-sm text-muted-foreground">
                                PDF, DOC, DOCX, TXT, or images (max 10MB each)
                              </p>
                            </div>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      {uploadedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50"
                        >
                          {getFileIcon(file.type)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{file.name}</p>
                            {file.size > 0 && (
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(file.size)}
                              </p>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => removeFile(file.id)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove file</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Deadline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="totalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            disabled
                            {...field}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground mt-1">
                          Auto-calculated: Price per Page × Total Pages
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price_per_page"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price per Page ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="total_pages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Pages</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deadline</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-3">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting && <Spinner className="mr-2" />}
                      {isEditing ? 'Update Order' : 'Create Order'}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href="/admin/orders">Cancel</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
