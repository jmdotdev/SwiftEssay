export const OrderCard = ({orderCount,orderType,Icon}) => {
  return (
    <div className='flex items-center justify-between w-full h-[100px] bg-white p-4'>
      <div className='w-1/2'>
          <h2>{orderCount}</h2>
          <h4>{orderType}</h4>
      </div>
      <div className='text-[50px] text-green-500 w-1/2 flex items-center justify-end'>
          <img className="h-[60px] w-[60px]" src={Icon} alt='orders-image.png'/>
      </div>
    </div>
  )
}
