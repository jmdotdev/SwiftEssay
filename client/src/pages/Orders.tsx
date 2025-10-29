import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import { OrderTable } from "@/components/OrderTable";
import { Order } from "@/types/Order";
import { Skeleton } from "@/components/ui/skeleton"
import { orderFilter } from "@/types/OrderFilter";
import { orderFiltersList } from "@/data/OrderFilters";
import { AddPaymentModal } from "@/components/AddPaymentModal";

export const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [orderFilters, setOrderFilters] = useState<orderFilter[]>(orderFiltersList);
  const [selectedFilter, setSelectedFilter] = useState<string>('Available');
  const [loading, setLoading] = useState<boolean>(true);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

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
          filterOrders(selectedFilter)
        });
    } catch (error) {
      toast.error("error fetching orders")
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id) => {
    try {
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


  const filterOrders = (filterName: string) => {
    setSelectedFilter(filterName)
    const filterOrders: Order[] = orders.filter(
      (order) => order.status.toLowerCase() === filterName.toLowerCase()
    );
    setFilteredOrders(filterName === 'All' ? orders : filterOrders);
    setOrderFilters(orderFilters.map(o => ({
      ...o,
      isActive: o.name.toLowerCase() === filterName.toLowerCase() ? true : false
    })));
  };

  const openAddPaymentModal = (id: string) => {
     console.log('id', id)
     setShowPaymentModal(prev => !prev)
  }
  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    filterOrders(selectedFilter)
  }, [orders, selectedFilter])

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] w-full px-5 py-0">
      {
        <div>
          <div className="flex items-center justify-between text-md my-5 mx-0">
            <Link className="decoration-0 ml-auto" to="add-order">
              <button className="flex items-center px-4 py-2 cursor-pointer text-md text-white rounded-md bg-darkBlue">Add Order</button>
            </Link>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between cursor-pointer bg-white w-full min-h-16 p-6 rounded-lg">
            {
              orderFilters.length &&
              orderFilters.map((filter, index) =>
                <a key={index} className="relative" onClick={() => filterOrders(filter.name)}>
                  {filter.isActive ? <p className="text-red-500">{filter.name}</p> : <p>{filter.name}</p>}
                  {
                    filter.isActive && <span className="absolute text-sm bottom-4 right-0 text-red-500">{selectedFilter === 'All' ? orders.length : filteredOrders.length}</span>
                  }
                </a>)
            }
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
                <OrderTable orders={filteredOrders} onDelete={(id) => deleteOrder(id)} openAddPaymentModal={(id) => openAddPaymentModal(id)}/>
              )}
            </div>
            { 
              showPaymentModal && <AddPaymentModal isOpen={false} handleClose={() => setShowPaymentModal(prev => !prev)} />
            }
          </div>
        </div>
      }
    </div>
  )
};
