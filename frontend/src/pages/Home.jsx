import Logo from '../assets/Logo.svg';
import UISketch from '../assets/UISketch.svg';
import { Link } from 'react-router-dom';

export default function Home() {
    return(
        <div className="flex flex-col gap-2 w-full h-screen">
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

            <div className='flex justify-between items-center gap-4 w-full h-full px-15 py-8'>
                    <div className='flex flex-col justify-center  w-full h-full'>
                        <div className='flex justify-center text-[#E013CC] items-center mb-4 rounded-md bg-[#FBE0F9] w-30 h-10 p-2 border border-[#E013CC]'>
                            Latest - <span className='font-bold'>v1.0</span> 
                        </div>
                        <h1 className='text-7xl text-[#E013CC] font-bold'>
                            PulseAI
                        </h1>
                        <p className='text-4xl text-[#E013CC] font-semibold mb-4'>
                            Smarter Automation, Real Results
                        </p>
                        <p className='text-[#1E1E1E] w-xl mb-4'>
                            Pulse AI is a full-stack AI-powered platform that helps businesses automate tasks, analyze data, and deliver intelligent insights. By combining AI/ML with user-friendly web and mobile interfaces, it empowers users to work smarter, faster, and more efficiently.
                        </p>

                        <Link to="/login"
                        className='flex justify-center items-center p-2 w-40 h-12  bg-[#E013CC] hover:bg-[#F9F9F9] text-[#F9F9F9] hover:text-[#E013CC] font-semibold border-2 border-[#E013CC] rounded-md duration-300'>
                            Explore AI
                        </Link>
                    </div>

                    <div className='flex justify-center items-center w-full h-full '>
                        <img src={UISketch} alt="UI Sketch" className='w-90'/>
                    </div>
            </div>
        </div>
    )
}