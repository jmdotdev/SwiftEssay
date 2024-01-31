import {React} from 'react'
import { useParams } from 'react-router-dom';
export const OrderDetails = () => {
  const { id } = useParams();
  return (
    <div>OrderDetails {id}</div>
  )
}

