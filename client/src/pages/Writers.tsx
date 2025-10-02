import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { AddWriterModal } from "@/components/AddWriterModal";
import { WritersTable } from "@/components/WritersTable";
import { Writer } from "@/types/Writer";
import { WriterFilter } from "@/types/WritersFilters";
import { writersFilters } from "@/data/WritersFilters";
import { Skeleton } from "@/components/ui/skeleton";

export const Writers = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const [writersList, setWritersList] = useState<Writer[]>([]);
  const [filteredWriters, setFilteredWrites] = useState<Writer[]>([]);
  const [newWriterAdded,setNewWriterAdded] = useState(false);
  const [filters, setFilters] = useState<WriterFilter[]>(writersFilters)
  const [loading, setLoading] = useState<Boolean>(false);
 
  
  const deleteWriter = async (row) =>{
      await axios.delete(`http://localhost:5000/writers/deleteWriter/${row.id}`)
      .then(async res=>{
        await fetchWriters();
        toast.success("writer deleted successfully")
      }).catch(error=>{
        toast.error(error.message)
      })
  }

  const fetchWriters = async () => {
    setLoading(true)
    await axios.get("http://localhost:5000/writers/getWriters").then((res) => {
      setWritersList(res.data);
      setFilteredWrites(writersList.filter(w => !w.is_assigned))
    }).catch(error=>{
      toast.error("error fetching writers")
    })
    .finally(()=>{
      setLoading(false)
    })
  };

  const selectFilter = (filter: WriterFilter) => {
    const filteredFilters =  filters.map(f=>({
      id: f.id,
      name: f.name,
      isActive: f.id === filter.id ? true : false
    }))
    setFilters(filteredFilters)
    if (filter.name.toLowerCase() === 'assigned') {
        console.log('executed is assigned')
        setFilteredWrites(writersList.filter(w => w.is_assigned))
    }
    if (filter.name.toLowerCase() === 'unassigned') {
        console.log('executed is not assigned')
        setFilteredWrites(writersList.filter(w => !w.is_assigned))
    }
    if (filter.name.toLowerCase() === 'active') {
        console.log('executed is active')
        setFilteredWrites(writersList.filter(w => w.is_active))
    }
    if (filter.name.toLowerCase() === 'inactive') {
        console.log('executed is not active')
        setFilteredWrites(writersList.filter(w => !w.is_active))
    }
  }

  useEffect(() => {
    fetchWriters();
  }, [newWriterAdded]);
  return (
    <div className="flex flex-col w-full h-[calc(100vh-100px)] px-5 py-0">
      <div className="flex items-center justify-between my-5 mx-0 text-xl font-semibold">
        <h4 className="text-darkBlue font-semibold text-xl">Writers</h4>
        <button className="bg-darkBlue text-white text-sm px-4 py-2 rounded-lg cursor-pointer" onClick={handleOpen}>
          Add Writer
        </button>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between bg-white w-full h-auto md:h-12 cursor-pointer px-2 py-7 rounded-lg">
        {filters.length &&
          filters.map((filter, i)=>  
          <a key={i} className="my-5 mx-0 relative" onClick={() => selectFilter(filter)}>
            { filter.isActive ? <span className="text-red-500">{filter.name}</span> : <span>{filter.name}</span>}
           {filter.isActive  && <span className="absolute bottom-2 ms-[0.5px] text-sm text-red-600">{filteredWriters.length}</span>}
        </a>)
        }
        <form className="mb-6 md:mb-0">
          <input className="h-6 p-4 border-[1px] border-gray-600 rounded-lg focus: outline-0" type="text" placeholder="search" />
        </form>
      </div>
      <div className="my-4 h-full w-full p-6 bg-white rounded-lg">
        {
           loading ? <div className="w-full h-full">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div> : <WritersTable writers={filteredWriters} />
        }
      </div>
      {
        setIsOpen && <AddWriterModal isOpen={isOpen} handleClose={handleClose} tiggerGetWriters={fetchWriters}/>
      }
    </div>
  );
};
