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
import { Star, X } from "lucide-react";
import { Textarea } from "./ui/textarea";

type ModalProps = {
  isOpen: boolean
  handleClose: () => void;
}
export function RateTaskModal({ isOpen, handleClose }: ModalProps) {  
  const [rating, setRating] = useState<Number>(0);

  const handleRating = (index: number) => {
      if (index + 1 === rating) {
         setRating(index)
      }
      else {
      setRating(index + 1)
      }
  } 

  const rateTask = async (e) => {
    // e.preventDefault();
    // const writer = writersList.find(writer =>writer._id == loggedInWriter.userId);
    // await axios.post('http://localhost:5000/writers/rateWriter',{
    //   writer_id:writer._id,
    //   task_id:order._id,
    //   rating:rate,
    //   comment
    // })
    // .then(res=>console.log(res))
  }
  return (
    <Dialog open={isOpen}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-darkBlue">Rate this task:</DialogTitle>
              <X className="h-5 w-5 cursor-pointer" onClick={handleClose} />
            </div>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="username-1">Rating</Label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((s, si) => (
                  <Star
                    key={si}
                    className="cursor-pointer"
                    fill={si < +rating ? "orange" : "white"}
                    stroke={si < +rating ? "none" : "black"}
                    onClick={() => handleRating(si)}
                  />
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Comment</Label>
              <Textarea />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer" onClick={handleClose}>Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-darkBlue cursor-pointer" onClick={rateTask}>Save rating</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
