import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { getUserData } from "../utils/getUserData";
import {
  academicLevels,
  citationOptions,
  orderDiscipline,
  paperTypes,
} from "../data/AddOrderFormOptions";

export const AddOrder = () => {
  const params = useParams();
  const [userPayload, setUserPayload] = useState<any>(null);
  const [files, setFiles] = useState<File[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OrderDetails>({
    defaultValues: {
      academic_level: "",
      type: "",
      discipline: "",
      topic: "",
      instructions: "",
      files: [],
      page_format: "",
      pages: 0,
      amount_payable: "",
      citations: 0,
      slides: 0,
      deadline: "",
    },
  });

  const pages = watch("pages");

  const onCreate = async (data: OrderDetails) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "files") {
          (value as File[]).forEach((file) => formData.append("files", file));
        } else {
          formData.append(key, value as string);
        }
      });

      const res = await axios.post(
        "http://localhost:5000/orders/createOrder",
        formData
      );
      window.location.href = res.data?.redirectionLink;
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  const onUpdate = async (data: OrderDetails) => {
    try {
      await axios.put(
        `http://localhost:5000/orders/updateOrder/${params.id}`,
        data
      );
      console.log("Order updated successfully!");
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const getOrderById = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/orders/getSingleOrder/${params.id}`
      );
      reset(res.data);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  useEffect(() => {
    setUserPayload(getUserData());
    if (params.id) {
      getOrderById();
    }
  }, [params.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    setFiles(selectedFiles);
    setValue("files", selectedFiles, { shouldValidate: true });
  };

  const onSubmit = (data: OrderDetails) =>
    params.id ? onUpdate(data) : onCreate(data);

  const validateFutureDate = (value: string) => {
    if (!value) return "Deadline is required";
    const now = new Date();
    const inputDate = new Date(value);
    return inputDate > now || "Deadline must be in the future";
  };

  return (
    <div className="flex flex-col h-full w-full p-5 overflow-auto">
      <div className="flex justify-center h-full mt-5">
        <div className="flex flex-col w-full md:w-2/3 h-full">
          <div className="w-full p-0">
            <h2 className="text-xl font-semibold">
              {params.id ? "Edit an Order" : "Place an Order"}
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Academic Level */}
            <div className="flex flex-col items-start border-0 mb-2">
              <label>Academic Level:</label>
              <select
                className="flex w-5/6 border-0 h-[40px] shadow-inputShadow focus:outline-none"
                {...register("academic_level", { required: "Required" })}
              >
                <option value="">Select level</option>
                {academicLevels.map((al) => (
                  <option key={al} value={al}>
                    {al}
                  </option>
                ))}
              </select>
              {errors.academic_level && (
                <p className="text-red-500 text-sm">
                  {errors.academic_level.message}
                </p>
              )}
            </div>

            {/* Type */}
            <div className="flex flex-col items-start border-0 mb-2">
              <label>Type:</label>
              <select
                className="flex w-5/6 border-0 h-[40px] shadow-inputShadow focus:outline-none"
                {...register("type", { required: "Required" })}
              >
                <option value="">Select type</option>
                {paperTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm">{errors.type.message}</p>
              )}
            </div>

            {/* Discipline */}
            <div className="flex flex-col items-start border-0 mb-2">
              <label>Discipline:</label>
              <select
                className="flex w-5/6 border-0 h-[40px] shadow-inputShadow focus:outline-none"
                {...register("discipline", { required: "Required" })}
              >
                <option value="">Select discipline</option>
                {orderDiscipline.map((discipline) => (
                  <option key={discipline} value={discipline}>
                    {discipline}
                  </option>
                ))}
              </select>
              {errors.discipline && (
                <p className="text-red-500 text-sm">
                  {errors.discipline.message}
                </p>
              )}
            </div>

            {/* Topic */}
            <div className="flex flex-col items-start border-0 mb-2">
              <label>Topic:</label>
              <input
                type="text"
                placeholder="topic"
                className="flex w-5/6 border-0 h-[40px] shadow-inputShadow px-1 focus:outline-none"
                {...register("topic", { required: "Required" })}
              />
              {errors.topic && (
                <p className="text-red-500 text-sm">{errors.topic.message}</p>
              )}
            </div>

            {/* Instructions */}
            <div className="flex flex-col items-start w-5/6 border-0 mb-2">
              <label>Instructions:</label>
              <textarea
                placeholder="paper instructions"
                className="flex border-0 h-36 w-full shadow-inputShadow px-1 focus:outline-none"
                {...register("instructions", { required: "Required" })}
              />
              {errors.instructions && (
                <p className="text-red-500 text-sm">
                  {errors.instructions.message}
                </p>
              )}
            </div>

            {/* Files */}
            <div className="flex flex-col items-start w-5/6 my-2 border-0 bg-gray-100">
              <label>Files:</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="shadow-inputBackground"
              />
              {errors.files && (
                <p className="text-red-500 text-sm">At least one file required</p>
              )}
            </div>

            {/* Page Format */}
            <div className="flex flex-col items-start border-0 mb-2">
              <label>Page Format:</label>
              <select
                className="flex w-5/6 border-0 h-[40px] shadow-inputShadow focus:outline-none"
                {...register("page_format", { required: "Required" })}
              >
                <option value="">Select format</option>
                {citationOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.page_format && (
                <p className="text-red-500 text-sm">
                  {errors.page_format.message}
                </p>
              )}
            </div>

            {/* Pages */}
            <div className="flex flex-col items-start border-0 mb-2">
              <label>Pages:</label>
              <input
                type="number"
                placeholder="number of pages"
                className="flex w-5/6 border-0 h-[40px] shadow-inputShadow px-1 focus:outline-none"
                {...register("pages", {
                  required: "Required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Cannot be negative" },
                })}
              />
              {errors.pages && (
                <p className="text-red-500 text-sm">{errors.pages.message}</p>
              )}
            </div>

            {/* Citations */}
            <div className="flex flex-col items-start border-0 mb-2">
              <label>Sources To Cite:</label>
              <input
                type="number"
                placeholder="cited sources"
                className="flex w-5/6 border-0 h-[40px] shadow-inputShadow px-1 focus:outline-none"
                {...register("citations", {
                  required: "Required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Cannot be negative" },
                })}
              />
              {errors.citations && (
                <p className="text-red-500 text-sm">
                  {errors.citations.message}
                </p>
              )}
            </div>

            {/* Slides */}
            <div className="flex flex-col items-start border-0 mb-2">
              <label>PowerPoint Slides:</label>
              <input
                type="number"
                placeholder="slides"
                className="flex w-5/6 border-0 h-[40px] shadow-inputShadow px-1 focus:outline-none"
                {...register("slides", {
                  required: "Required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Cannot be negative" },
                })}
              />
              {errors.slides && (
                <p className="text-red-500 text-sm">{errors.slides.message}</p>
              )}
            </div>

            {/* Deadline */}
            <div className="flex flex-col items-start border-0 mb-2">
              <label>Deadline:</label>
              <input
                type="datetime-local"
                className="flex w-5/6 border-0 h-[40px] shadow-inputShadow px-1 focus:outline-none"
                {...register("deadline", {
                  validate: validateFutureDate,
                })}
              />
              {errors.deadline && (
                <p className="text-red-500 text-sm">
                  {errors.deadline.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center px-4 py-2 rounded-md w-1/4 my-2 bg-darkBlue text-white border-0 cursor-pointer"
            >
              {isSubmitting
                ? "Processing..."
                : params.id
                ? "Update Order"
                : "Checkout"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="hidden md:block md:w-1/3 mt-6">
          <div className="flex flex-col items-start w-full h-1/2 bg-darkBlue text-white rounded-sm shadow-inputShadow p-2">
            <div className="w-full py-2 px-0">
              <h3>Order Details</h3>
            </div>
            <div className="w-full border-b border-gray-600">
              <p>Type of paper</p>
              <p>Discipline of paper</p>
            </div>

            <div className="flex flex-col w-full h-full">
              <div className="flex items-center justify-between w-full my-2 border-b border-gray-600">
                <p>{pages || 0} pages</p>
                <p>* ksh 300</p>
              </div>
              <div className="flex items-center justify-between">
                <p>
                  <b>Total Price</b>
                </p>
                <p>
                  <b>{(pages || 0) * 300}</b>
                </p>
              </div>
              <div className="flex items-end h-full">
                <p>Secure payments via:</p>
                <img
                  src="/images/paypal.png"
                  alt="paypal"
                  className="h-8 ml-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};