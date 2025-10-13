import { LucideIcon } from "lucide-react";

type PaymentCardProps = {
  amount: number;
  title: string;
  icon: LucideIcon
}
export const PaymentCard = ({amount, title, icon: Icon}: PaymentCardProps) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-md p-4">
        <div className="flex flex-col w-1/2">
            <p>Ksh {amount}</p>
            <p>{title}</p>
        </div>
        <div className="flex items-center justify-end w-1/2">
         <Icon className="h-12 w-12" strokeWidth={2} style={{color: title === 'Canceled' ? 'red' : '#83CD02'}}/>
        </div>
    </div>
  )
}
