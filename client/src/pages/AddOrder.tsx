import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import {
  academicLevels,
  citationOptions,
  orderDiscipline,
  paperTypes,
} from "../data/AddOrderFormOptions";
import { getUserData } from "@/utils/getUserData";

type OrderFormData = {
  academic_level: string;
  type: string;
  discipline: string;
  topic: string;
  instructions: string;
  files: FileList;
  page_format: string;
  pages: number;
  amount_payable: string;
  citations: number;
  slides: number;
  deadline: string;
};

export const AddOrder = () => {
  const params = useParams<{ id?: string }>();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrderFormData>({
    defaultValues: {
      academic_level: "",
      type: "",
      discipline: "",
      topic: "",
      instructions: "",
      files: undefined as unknown as FileList,
      page_format: "",
      pages: 0,
      amount_payable: "",
      citations: 0,
      slides: 0,
      deadline: "",
    },
  });

  // Fetch order if updating
  const getOrderById = async () => {
    try {
      const res = await axios.get<OrderFormData>(
        `http://localhost:5000/orders/getSingleOrder/${params.id}`
      );
      const order = res.data;
       const formattedDeadline = order.deadline
      ? new Date(order.deadline).toISOString().slice(0, 16)
      : "";

      setValue("academic_level", order.academic_level);
      setValue("type", order.type);
      setValue("discipline", order.discipline);
      setValue("topic", order.topic);
      setValue("instructions", order.instructions);
      setValue("page_format", order.page_format);
      setValue("pages", order.pages);
      setValue("citations", order.citations);
      setValue("slides", order.slides);
      setValue("deadline", formattedDeadline);
    } catch (err) {
      console.error("Failed to fetch order:", err);
    }
  };

  useEffect(() => {
    getUserData();
    if (params.id) getOrderById();
  }, [params.id]);

  const onSubmit: SubmitHandler<OrderFormData> = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "files" && value instanceof FileList) {
          Array.from(value).forEach((file) => formData.append("files", file));
        } else {
          formData.append(key, String(value));
        }
      });
      
      if (params.id) {
        await axios.put(
          `http://localhost:5000/orders/updateOrder/${params.id}`,
          data
        );
      } else {
        const res = await axios.post(
          "http://localhost:5000/orders/createOrder",
          formData
        );
        window.location.href = res.data?.redirectionLink;
      }
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  const pages = watch("pages");
  const type = watch('type');
  const discipline = watch('discipline')

  return (
    <div className="flex flex-col h-full w-full p-5 overflow-auto">
      <div className="flex justify-center h-full mt-5">
        <div className="flex flex-col w-full md:w-2/3 h-full">
          <div className="w-full p-0">
            <h2 className="text-xl font-semibold">
              {params.id ? "Edit an Order" : "Place an Order"}
            </h2>
          </div>

          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Academic Level */}
              <div className="flex flex-col items-start justify-center border-0">
                <label>Academic Level:</label>
                <select
                  className="flex w-5/6 border-0 h-[40px] shadow-inputShadow appearance-none focus:outline-none"
                  {...register("academic_level", { required: "Required" })}
                >
                  <option value="">Select level</option>
                  {academicLevels.map((al) => (
                    <option key={al}>{al}</option>
                  ))}
                </select>
                {errors.academic_level && (
                  <p className="text-red-500 text-sm">
                    {errors.academic_level.message}
                  </p>
                )}
              </div>

              {/* Type */}
              <div className="flex flex-col items-start justify-center border-0">
                <label>Type:</label>
                <select
                  className="flex w-5/6 border-0 h-[40px] shadow-inputShadow appearance-none focus:outline-none"
                  {...register("type", { required: "Required" })}
                >
                  <option value="">Select type</option>
                  {paperTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
                {errors.type && (
                  <p className="text-red-500 text-sm">{errors.type.message}</p>
                )}
              </div>

              {/* Discipline */}
              <div className="flex flex-col items-start justify-center border-0">
                <label>Discipline:</label>
                <select
                  className="flex w-5/6 border-0 h-[40px] shadow-inputShadow appearance-none focus:outline-none"
                  {...register("discipline", { required: "Required" })}
                >
                  <option value="">Select discipline</option>
                  {orderDiscipline.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                {errors.discipline && (
                  <p className="text-red-500 text-sm">
                    {errors.discipline.message}
                  </p>
                )}
              </div>

              {/* Topic */}
              <div className="flex flex-col items-start justify-center border-0">
                <label>Topic:</label>
                <input
                  className="flex w-5/6 border-0 h-[40px] shadow-inputShadow px-1 appearance-none focus:outline-none"
                  type="text"
                  placeholder="topic"
                  {...register("topic", { required: "Required" })}
                />
                {errors.topic && (
                  <p className="text-red-500 text-sm">{errors.topic.message}</p>
                )}
              </div>

              {/* Instructions */}
              <div className="flex flex-col items-start justify-center border-0 w-5/6">
                <label>Instructions:</label>
                <textarea
                  className="flex border-0 w-full h-24 shadow-inputShadow px-1 appearance-none focus:outline-none"
                  placeholder="paper instructions"
                  {...register("instructions", { required: "Required" })}
                />
                {errors.instructions && (
                  <p className="text-red-500 text-sm">
                    {errors.instructions.message}
                  </p>
                )}
              </div>

              {/* Files */}
              <div className="flex flex-col items-start justify-center w-5/6 my-2 border-0 bg-gray-100">
                <label>Files:</label>
                <input
                  className="shadow-inputBackground"
                  type="file"
                  multiple
                  {...register("files")}
                />
              </div>

              {/* Page Format */}
              <div className="flex flex-col items-start justify-center border-0">
                <label>Page Format</label>
                <select
                  className="flex w-5/6 border-0 h-[40px] shadow-inputShadow appearance-none focus:outline-none"
                  {...register("page_format", { required: "Required" })}
                >
                  <option value="">Select format</option>
                  {citationOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                {errors.page_format && (
                  <p className="text-red-500 text-sm">
                    {errors.page_format.message}
                  </p>
                )}
              </div>

              {/* Pages */}
              <div className="flex flex-col items-start justify-center border-0">
                <label>Pages:</label>
                <input
                  className="flex w-5/6 border-0 h-[40px] shadow-inputShadow px-1 appearance-none focus:outline-none"
                  type="number"
                  placeholder="number of pages"
                  {...register("pages", {
                    required: "Required",
                    min: { value: 1, message: "Must be at least 1" },
                    valueAsNumber: true,
                  })}
                />
                {errors.pages && (
                  <p className="text-red-500 text-sm">{errors.pages.message}</p>
                )}
              </div>

              {/* Citations */}
              <div className="flex flex-col items-start justify-center border-0">
                <label>Sources To Cite:</label>
                <input
                  className="flex w-5/6 border-0 h-[40px] shadow-inputShadow px-1 appearance-none focus:outline-none"
                  type="number"
                  placeholder="cited sources"
                  {...register("citations", { valueAsNumber: true, min: 2 })}
                />
              </div>

              {/* Slides */}
              <div className="flex flex-col items-start justify-center border-0">
                <label>Powerpoint Slides:</label>
                <input
                  className="flex w-5/6 border-0 h-[40px] shadow-inputShadow px-1 appearance-none focus:outline-none"
                  type="number"
                  placeholder="powerpoint slides"
                  {...register("slides", { valueAsNumber: true, min: 0 })}
                />
              </div>

              {/* Deadline */}
              <div className="flex flex-col items-start justify-center border-0">
                <label>Deadline:</label>
                <input
                  className="flex w-5/6 border-0 h-[40px] shadow-inputShadow px-1 appearance-none focus:outline-none"
                  type="datetime-local"
                  {...register("deadline", { required: "Required" })}
                />
                {errors.deadline && (
                  <p className="text-red-500 text-sm">
                    {errors.deadline.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="flex items-center justify-center px-4 py-2 rounded-md w-1/4 my-2 bg-darkBlue text-white border-0 cursor-pointer"
              >
                Checkout
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="hidden md:block md:w-1/3 mt-6">
          <div className="flex flex-col items-start w-full h-1/2 bg-darkBlue text-white rounded-sm shadow-inputShadow p-2">
            <div className="w-full py-2 px-0">
              <h3>Order Details</h3>
            </div>
            <div className="w-full border-b-[1px] border-gray-600">
              <div className="flex items-center justify-between">
                <p>Type of paper</p>
                <p>{type}</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Discipline of paper</p>
                <p>{discipline}</p>
              </div>
            </div>

            <div className="flex flex-col w-full h-full">
              <div className="flex items-center justify-between w-full my-2 border-b-[1px] border-gray-600">
                <p>{pages} pages</p>
                <p>* ksh 300</p>
              </div>
              <div className="flex items-center justify-between">
                <p>
                  <b>Total Price</b>
                </p>
                <p>
                  <b>{pages * 300}</b>
                </p>
              </div>
              <div className="flex items-end h-full">
                <p>Secure payments via:</p>
                <img
                  src="/images/paypal.png"
                  alt="paypal"
                  className="h-8"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};