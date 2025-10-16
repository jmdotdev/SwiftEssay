import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from 'react-hook-form';

type RegisterFormInputs = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const Register = () => {
  const navigate = useNavigate()
  const { handleSubmit, register, watch, formState: {errors} } = useForm<RegisterFormInputs>();

  const registerUser: SubmitHandler<RegisterFormInputs> = async (value) => {
   try {
      const res = await axios.post("http://localhost:5000/clients/registerClient", {
          username: value.username,
          email: value.email,
          password: value.password,
        });
        toast.success('User registered successfully. Redirecting to login...')
        navigate('/login')
   } catch (error) {
    const err = error.response.data?.error.replace('"', '').replace('"','') ?? 'An error has occured';
    toast.error(err)
   }
  };

  const passwordValue = watch('password')
  return (
      <div className="flex w-full min-w-screen h-full min-h-screen overflow-y-hidden">
        <div className="hidden md:flex items-center justify-center h-full md:w-1/2 bg-darkBlue text-white text-center">
          <div className="flex flex-col items-center h-1/2">
            <img src="/images/login.webp" alt="reader.png" />
            <h3 className="font-bold text-3xl">SwiftEssay</h3>
            <p className="w-4/5 my-4">
              Even if you don’t have sufficient statistics or ratings, we’ve got
              your back You will still be able to get plenty of orders any time.
            </p>
          </div>
        </div>
        <div className="flex w-full items-center md:w-1/2 p-4 md:p-8 bg-siteBackground">
          <div className="flex flex-col w-[90vw] md:w-[40vw]">
            <div className="flex items-center justify-start p-0">
              <img
                className="h-12 w-12 -ml-1"
                src="/images/notepad.png"
                alt="notepad.png"
              />
              <h3 className="text-2xl font-bold text-darkBlue ml-1 -mb-3">
                Join SwiftEssay!!
              </h3>
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold text-darkBlue">SignUp</h3>
              <p className="text-md">
                Create an account with us and guarantee constant work
              </p>
            </div>
            <div className="flex flex-col w-full">
              <form onSubmit={handleSubmit(registerUser)}>
                <div className="w-full text-start my-2">
                  <label className="font-semibold">Username:</label>
                </div>
                <div className="flex flex-col text-start w-full">
                  <input
                    className="shadow-2xl h-12 w-full rounded-md px-2 focus:outline-0"
                    type="text"
                    name="username"
                    placeholder="username"
                    {...register('username',{required: 'username is required'})}
                  />
                  {errors.username && <span className='w-full text-start text-red-500 mt-2 text-sm'>{ errors.username.message }</span>}
                </div>
                <div className="w-full text-start my-2">
                  <label className="font-semibold">Email:</label>
                </div>
                <div className="flex flex-col text-start w-full ">
                  <input
                    className="shadow-2xl h-12 w-full rounded-md px-2 focus:outline-0"
                    type="email"
                    name="email"
                    placeholder="email"
                   {...register('email',{required: 'email is required'})}
                  />
                  {errors.username && <span className='w-full text-start text-red-500 mt-2 text-sm'>{ errors.email.message }</span>}
                </div>
                <div className="w-full text-start my-2">
                  <label className="font-semibold">Password:</label>
                </div>
                <div className="flex flex-col text-start w-full ">
                  <input
                    className="shadow-2xl h-12 w-full rounded-md px-2 focus:outline-0"
                    type="password"
                    name="password"
                    placeholder="password"
                    {...register('password',{required: 'password is required'})}
                  />
                  {errors.password && <span className='w-full text-start text-red-500 mt-2 text-sm'>{ errors.password.message }</span>}
                </div>
                <div className="w-full text-start my-2">
                  <label className="font-semibold">Confirm Password:</label>
                </div>
                <div className="flex flex-col text-start w-full ">
                  <input
                    className="shadow-2xl h-12 w-full rounded-md px-2 focus:outline-0"
                    type="password"
                    name="confirm password"
                    placeholder="confirm password"
                    {...register('confirmPassword',
                    {required: 'confirmPassword is required',
                     validate: (value) => value === passwordValue || 'Passwords do not match' 
                    })}
                  />
                  {errors.confirmPassword && <span className='w-full text-start text-red-500 mt-2 text-sm'>{ errors.confirmPassword.message }</span>}
                </div>
                <div className="w-full text-start">
                  <button className="bg-darkBlue text-white rounded-md mt-2 w-1/2 md:w-1/4 px-4 py-2 cursor-pointer">
                    Sign Up
                  </button>
                </div>
              </form>
              <Link to="/login">
                <h4 className="my-2 cursor-pointer">
                  Already have an account?{" "}
                  <a className="underline underline-offset-1">Login</a>
                </h4>
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
};
