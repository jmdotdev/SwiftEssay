import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import { OrderTable } from "@/components/OrderTable";
import { Order } from "@/types/Order";
import { Skeleton } from "@/components/ui/skeleton"

export const Orders = () => {
  const [orders, setOrders] = useState<Order[]>();
  const [filteredOrders, setFilteredOrders] = useState<Order[]>()
  const [loading, setLoading] = useState(true);

  const getOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      await axios
        .get("http://localhost:5000/orders/getOrders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setOrders(res.data)
        });
    } catch (error) {
      toast.error("error fetching orders")
    } finally {
      // Set loading to false whether the request is successful or not
      setLoading(false);
    }
  };

  const deleteOrder = async (id) => {
    try {
      console.log("id", id)
      await axios.delete(`http://localhost:5000/orders/deleteOrder/${id}`)
        .then(async res => {
          await getOrders();
          toast.success("order deleted successfully")
        }).catch(error => {
          toast.error("error deleting order")
        })
    }
    catch (error) {
      toast.error("error deleting order")
    }
  }


  const filterOrder = (filter: string) => {
    const filterOrders: Order[] = filteredOrders.filter(
      (order) => order.status === filter
    );
    setOrders(filterOrders)
  };
  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] w-full px-5 py-0">
      {
        <div>
          <div className="flex items-center justify-between text-md my-5 mx-0">
            <h4 className="text-darkBlue font-semibold text-xl">Orders</h4>
            <Link className="decoration-0" to="add-order">
              <button className="flex items-center px-4 py-2 cursor-pointer text-md text-white rounded-md bg-darkBlue">Add Order</button>
            </Link>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between cursor-pointer bg-white w-full min-h-16 p-6 rounded-lg">
            <a className="relative" onClick={() => filterOrder("available")}>
              Available<span className="absolute text-sm bottom-2 text-red-500">0</span>
            </a>
            <a onClick={() => filterOrder("assigned")}>Assigned</a>
            <a onClick={() => filterOrder("Pending")}>Pending</a>
            <a onClick={() => filterOrder("Completed")}>Completed</a>
            <a onClick={() => filterOrder("Revision")}>Revision</a>
            <a onClick={() => filterOrder("Progress")}>Progress</a>
            <a onClick={() => filterOrder("Cancelled")}>Cancelled</a>
          </div>
          <div className="mt-5 h-4/5 w-full bg-white p-6 rounded-lg">
            <div style={{ height: 350, width: "100%" }}>
              {loading ? (
                <div className="w-full h-full">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ) : (
                <OrderTable orders={orders} />
              )}
            </div>
          </div>
        </div>
      }
    </div>
  )
};
