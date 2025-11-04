import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Order } from "@/types/Order";
import { X } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

type ModalProps = {
  isOpen: boolean
  handleClose: () => void;
  selectedOrder: Order;
}
type FormInputs = {
  code: string;
  amount: number;
  method: string;
}
export function AddPaymentModal({ isOpen, handleClose, selectedOrder }: ModalProps) {
  const { handleSubmit, register, formState: { errors } } = useForm<FormInputs>();

  const addPayment: SubmitHandler<FormInputs> = async (value) => {
    const payload = {
      order: selectedOrder._id,
      paymentCode: value.code,
      amount: value.amount,
      currency: 'KSH',
      method: value.method
    }
    console.log('payload', payload);
    console.log('selectedOrder', selectedOrder)
  }
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-darkBlue">Add Payment</DialogTitle>
            <X className="h-5 w-5 cursor-pointer" onClick={handleClose} />
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit(addPayment)}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="code-1">Payment Code</Label>
              <Input id="code-1" type="text" defaultValue='' {...register('code', { required: 'Payment Code is required' })} />
              {errors.code && <span className='w-full text-start text-red-500 text-sm'>{errors.code.message}</span>}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="amount-1">Amount</Label>
              <Input id="amount-1" type="number" defaultValue='' {...register('amount', { required: 'Amount is required' })} />
              {errors.amount && <span className='w-full text-start text-red-500 text-sm'>{errors.amount.message}</span>}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="method-1">Method</Label>
              <Input id="method-1" type="text" defaultValue='' {...register('method', { required: 'Payment Method is required' })} placeholder="m-pesa" />
              {errors.method && <span className='w-full text-start text-red-500 text-sm'>{errors.method.message}</span>}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button" className="cursor-pointer" onClick={handleClose}>Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-darkBlue cursor-pointer">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
