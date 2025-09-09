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
import { toast } from 'react-toastify';
import axios from "axios"
import { X } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

type ModalProps = {
  isOpen: boolean
  handleClose: () => void;
  tiggerGetWriters: () => void;
}
type FormInputs = {
  username: string;
  email: string;
  phone: string;
  password: string
}
export function AddWriterModal({ isOpen, handleClose, tiggerGetWriters }: ModalProps) {
  const { handleSubmit, register, reset, formState: { errors } } = useForm<FormInputs>();
  const addWriter: SubmitHandler<FormInputs> = async (value) => {
    await axios
      .post("http://localhost:5000/writers/registerWriter", {
        username: value.username,
        email: value.email,
        phone: value.phone,
        password: value.password,
      })
      .then((res) => {
        toast.success("writer added successfully")
        reset()
        handleClose()
        tiggerGetWriters()
      }).catch(error => toast.error("error adding writer"))
  }
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-darkBlue">Add Writer</DialogTitle>
            <X className="h-5 w-5 cursor-pointer" onClick={handleClose} />
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit(addWriter)}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" type="text" defaultValue='' {...register('username', { required: 'Username is required' })} />
              {errors.username && <span className='w-full text-start text-red-500 text-sm'>{errors.username.message}</span>}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email-1">Email</Label>
              <Input id="email-1" type="email" defaultValue='' {...register('email', { required: 'Email is required' })} />
              {errors.email && <span className='w-full text-start text-red-500 text-sm'>{errors.email.message}</span>}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="phone-1">Phone</Label>
              <Input id="phone-1" type="text" defaultValue='' {...register('phone', { required: 'Phone is required' })} />
              {errors.phone && <span className='w-full text-start text-red-500 text-sm'>{errors.phone.message}</span>}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password-1">Password</Label>
              <Input id="password-1" type="password" defaultValue='' {...register('password', { required: 'Password is required' })} />
              {errors.password && <span className='w-full text-start text-red-500 text-sm'>{errors.password.message}</span>}
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
