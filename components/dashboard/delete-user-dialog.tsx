'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { Writer } from '@/lib/types'


interface DeleteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  handleDelete: () => void
}

export function DeleteUserDialog({
  open,
  onOpenChange,
  handleDelete,
}: DeleteUserDialogProps) {


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
         <DialogHeader>
              <DialogTitle>
                Delete Writer
              </DialogTitle>
              <DialogDescription>
                <h2 className="text-red-700 font-semibold">Are you sure you want to delete this writer? This action cannot be undone.</h2>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button
                className="cursor-pointer"
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                >
                 Cancel
                </Button>
                <Button type="submit"  variant="destructive" className="cursor-pointer" onClick={handleDelete}>
                 Delete
                </Button>
            </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}