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
import { useState } from "react"
import { X } from "lucide-react";

type ModalProps = {
  isOpen: boolean
  handleClose: () => void;
}
export function AddWriterModal({isOpen, handleClose}: ModalProps) {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState();
  const [newWriterAdded,setNewWriterAdded] = useState(false);
  
  const handleSave = async () => {
    await axios
      .post("http://localhost:5000/writers/registerWriter", {
        username,
        email,
        phone,
        password,
      })
      .then((res) => {
        setNewWriterAdded(!newWriterAdded)
        toast.success("writer added successfully")
      }).catch(error => toast.error("error adding writer"))
  }
  return (
    <Dialog open={isOpen}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center justify-between">
               <DialogTitle className="text-darkBlue">Add Writer</DialogTitle>
               <X  className="h-5 w-5 cursor-pointer" onClick={handleClose}/>
            </div>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" type="text"/>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email-1">Email</Label>
              <Input id="email-1" name="email" type="email"/>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="phone-1">Phone</Label>
              <Input id="phone-1" name="phone" type="number"/>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password-1">Password</Label>
              <Input id="password-1" name="password" type="password"/>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer"  onClick={handleClose}>Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-darkBlue cursor-pointer" onClick={handleSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
