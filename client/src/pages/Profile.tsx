import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
export const Profile = () => {
  let params = useParams()
  const [userData, setUserData] = useState()

  const getWriterData = async () => {
    await axios.get(`http://localhost:5000/writers/writer/${params.id}`)
      .then(res => {
        console.log(res.data)
        setUserData(res.data)
      })
  }
  useEffect(() => {
    const fetchData = async () => {
      await getWriterData();
    }
    fetchData();
  }, [])



  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row items-center p-4 w-full h-auto mt-6">
        <div className="flex flex-col text-center w-full md:w-1/2 bg-white rounded-xl p-4 mx-2">
          <img src='/images/avatar.webp' alt="Profile Picture" className="h-48 w-48 mx-auto" />
          <h2 className="text-semibold">Email: test@gmail.com</h2>
          <h2 className="text-semibold">Username: John Doe</h2>
          <h2 className="font-semibold underline text-xl">About Me</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonummy
            tincidunt ut lacreet dolore magna aliguam erat volutpat. Ut wisis
            enim ad minim veniam, quis nostrud exerci tation ullamcorper
            suscipit lobortis nisl ut aliquip ex ea commodo consequat.
          </p>
        </div>

        <div className="flex flex-col w-full md:w-1/2 mx-2">
          <div className="flex items-center justify-end">
              <button className="w-1/2 md:w-1/3 lg:w-1/4 bg-darkBlue rounded-md px-4 py-2 text-white cursor-pointer focus:outline-none hover:opacity-90 mt-4 md:mt-0">Edit Profile</button>
          </div>
          <div className="flex flex-col bg-white rounded-xl p-4 my-4">
            <h2 className="text-xl font-bold underline">Skills</h2>
            <ul>
              <li>Academic Writing</li>
              <li>Research</li>
              <li>Editing and Proofreading</li>
              <li>Creative Writing</li>
            </ul>
          </div>
          <div className="flex flex-col bg-white rounded-xl p-4">
            <h2>Task Statistics</h2>
            <ul>
              <li>
                <strong>Completed Tasks:</strong> {userData?.assigned_tasks?.length}
              </li>
              <li>
                <strong>In Progress:</strong> 10
              </li>
              <li>
                <strong>Cancelled Tasks:</strong> 5
              </li>
              <li>
                <strong>Tasks in Revision:</strong> 3
              </li>
              <li>
                <strong>Overall Rating:</strong> 4.8
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
