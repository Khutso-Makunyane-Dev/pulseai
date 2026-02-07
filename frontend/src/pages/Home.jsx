import Logo from '../assets/Logo.svg';
import { Link } from 'react-router-dom';

export default function Home() {
    return(
        <div className="flex flex-col w-full h-screen">
            <div className="flex justify-between items-center bg-[#F9F9F9] w-full h-20 p-4">
                <div className=" w-auto h-auto p-2">
                    <a href="">
                    <img src={Logo} alt="Web Logo" className='w-15' />
                    </a>
                </div>

                <div className=" flex justify-center items-center gap-10 w-auto h-auto p-2">
                    <a href="" className='text-[#1E1E1E] hover:text-[#E013CC] font-semibold duration-300'>Home</a>
                    <a href="" className='text-[#1E1E1E] hover:text-[#E013CC] font-semibold duration-300'>About</a>
                    <a href="" className='text-[#1E1E1E] hover:text-[#E013CC] font-semibold duration-300'>How it Works</a>
                    <a href="" className='text-[#1E1E1E] hover:text-[#E013CC] font-semibold duration-300'>Contact</a>
                </div>

                <div className="w-auto h-auto p-2">
                    <Link to="/signup"
                    className='py-2 px-5 bg-[#F9F9F9] hover:bg-[#E013CC] text-[#E013CC] hover:text-[#F9F9F9] mr-3 font-semibold border-2 border-[#E013CC] rounded-md duration-300'>
                        Sign Up
                    </Link>

                    <Link to="/login"
                    className='py-2 px-5 bg-[#E013CC] hover:bg-[#F9F9F9] text-[#F9F9F9] hover:text-[#E013CC] font-semibold border-2 border-[#E013CC] rounded-md duration-300'>
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    )
}