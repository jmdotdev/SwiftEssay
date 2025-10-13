import{ useState } from "react";
import { PaymentCard } from "@/components/PaymentCard";
import { Payment } from "@/types/Payment";
import { samplePayments } from "@/data/PaymentsData";
import { PaymentsTable } from "@/components/PaymentsTable";
import { Ban, CircleCheckBig, RefreshCcw } from "lucide-react";
export const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>(samplePayments)
  return (
    <div className="p-6 mt-8">
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <div className="w-full md:w-1/3">
           <PaymentCard amount={5000} title={"Pending"} icon={RefreshCcw} />
        </div>
        <div className="w-full md:w-1/3 mx-6">
           <PaymentCard amount={0} title={"Paid"} icon={CircleCheckBig}/>
        </div>
        <div className="w-full md:w-1/3">
           <PaymentCard amount={0} title={"Canceled"} icon={Ban}/>
        </div>
      </div>
      <div className="bg-white rounded-md mt-6">
        <div className="my-4 h-full w-full p-6">
          <PaymentsTable payments={payments} />
        </div>
      </div>
    </div>
  );
};
