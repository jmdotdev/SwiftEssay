import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify';
import { SubmitHandler, useForm } from "react-hook-form";

type LoginFormInputs = {
  email: string;
  password: string;
}
export const Login = () => {
  const navigate = useNavigate();
  const { handleSubmit, register, formState: {errors} } = useForm<LoginFormInputs>();

  const loginUser: SubmitHandler<LoginFormInputs> = async (value) => {
     try {
        const res = await axios.post('http://localhost:5000/writers/login', {
          email: value.email, password: value.password
        });
        localStorage.setItem('token', res.data.token);
        toast.success("Login Successful");
        navigate("/dashboard");
      } catch (error) {
        toast.error("Invalid username or password");
      }
  };

  return (
    <div className="flex w-full min-w-screen h-full min-h-screen overflow-y-hidden">
      <div className="hidden md:flex items-center justify-center h-full md:w-1/2 bg-darkBlue text-white text-center">
        <div className="flex flex-col items-center h-1/2">
          <img src="/images/login.webp" alt="reader.png" />
          <h3 className="font-bold text-3xl">SwiftEssay</h3>
          <p className="w-4/5 my-4">Even if you don’t have sufficient statistics or ratings, we’ve got your back You will still be able to get plenty of orders any time.</p>
        </div>
      </div>
      <div className="flex w-full items-center justify-start md:w-1/2 p-4 md:p-8 bg-siteBackground">
      <div className="flex flex-col w-[90vw] md:w-[40vw]">
          <div className="flex items-center justify-start p-0">
          <img className="h-12 w-12 -ml-1" src="/images/notepad.png" alt="notepad.png" />
          <h3 className="text-2xl font-bold text-darkBlue ml-1">Welcome Back!!</h3>
        </div>
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold text-darkBlue">Signin</h3>
          <p className="text-md">Access the academic writing portal using your email and password.</p>
        </div>
        <div className="flex flex-col">
          <form onSubmit={handleSubmit(loginUser)} >
            <div className="w-full text-start my-2">
                <label className="font-semibold">Email:</label>
            </div>
            <div className="flex flex-col w-full">
              <input
                className="shadow-2xl h-12 w-full rounded-md px-2 focus:outline-0"
                type="email"
                name="email"
                placeholder="email"
                {...register('email',{required: 'Email is required'})}
              />
              {errors.email && <span className='w-full text-start text-red-500 mt-2 text-sm'>{ errors.email.message }</span>}
            </div>
            <div className="w-full text-start my-2">
                <label className="font-semibold">Password:</label>
            </div>
            <div className="flex flex-col w-full ">
              <input
                className="shadow-2xl h-12 w-full rounded-md px-2 focus:outline-0"
                type="password"
                name="password"
                placeholder="password"
                {...register('password',{required: 'Password is required'})}
              />
              {errors.password && <span className='w-full text-start text-red-500 mt-2 text-sm'>{ errors.password.message }</span>}
            </div>
            <div className="w-full text-start"> 
            <button className="bg-darkBlue text-white rounded-md mt-2 w-1/2 md:w-1/4 px-4 py-2 cursor-pointer" type="submit">Sign In</button>
            </div>
          </form>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full ">         
             <h4 className="my-2 cursor-pointer">Forgot Password?</h4>
             <Link to="/register">
                <h4 className="my-2 cursor-pointer">
                  Don't have an account?{" "}
                  <a className="underline underline-offset-1">register</a>
                </h4>
              </Link>
        </div>
        </div>
      </div>
      </div>
    </div>
  );
};
