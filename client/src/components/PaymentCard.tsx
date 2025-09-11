export const PaymentCard = () => {
  return (
    <div className="flex items-center justify-between bg-white rounded-md p-4">
        <div className="flex flex-col w-1/2">
            <p>$500</p>
            <p>Total Income</p>
        </div>
        <div className="flex items-center justify-end w-1/2">
          <img src="/images/money.webp"  className="h-20 w-20"/>
        </div>
    </div>
  )
}
