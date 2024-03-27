import React from "react";
import { Link } from 'react-router-dom'
import logo from '../images/logo.png'
import hexagon from '../images/SVGs/hexagon.svg'
import hexagon2 from '../images/SVGs/hexagon2.svg'

export const Home = ()=>{

    return (
    <div>
        <div className=' h-40 w-full grid'>
          <img className='justify-self-center self-start w-40 md:w-60 mt-10' src={logo} alt="" />
        </div>

        <h1 className='text-3xl md:text-5xl text-pj-white text-center leading-[140%] md:leading-[120%]'>
          Working Hard Like A <br /> <strong className=' text-pj-primary text-3xl md:text-5xl'>Bee</strong>
        </h1>

        <div className='flex flex-col items-center mt-20 md:mt-4'>
            <div className='grid grid-flow-col col-span-2 w-fit -mb-5 md:-mb-6 gap-2'>
                <Link to={'/services'} className='relative w-24 md:w-28 cursor-pointer hover:-translate-x-1 hover:-translate-y-1 transition ease-in-out duration-200'>
                    <img className="w-24 md:w-28 z-20" src={hexagon} alt="" />
                    <p className='absolute z-30 flex justify-center w-24 md:w-28 top-1/2 transform -translate-y-1/2 text-base md:text-xl text-pj-primary'>Services</p>
                </Link>

                <Link to={'/prices'} className='relative w-24 md:w-28 cursor-pointer hover:translate-x-1 hover:-translate-y-1 transition ease-in-out duration-200'>
                    <img className="w-24 md:w-28 z-20" src={hexagon} alt="" />
                    <p className='absolute z-30 flex justify-center w-24 md:w-28 top-1/2 transform -translate-y-1/2 text-base md:text-xl text-pj-primary'>Prices</p>
                </Link>
            </div>
          
            <div className='grid grid-flow-col col-span-3 gap-2'>
                    <Link to={'/team'} className='relative w-24 md:w-28 cursor-pointer hover:-translate-x-1 transition ease-in-out duration-200'>
                        <img className="w-24 md:w-28 z-20" src={hexagon} alt="" />
                        <p className='absolute z-30 flex justify-center w-24 md:w-28 top-1/2 transform -translate-y-1/2 text-base md:text-xl text-pj-primary'>Team</p>
                    </Link>

                    <Link to={''} className='relative w-24 md:w-28 cursor-pointer hover:scale-90 transition ease-in-out duration-200'>
                        <img className="w-24 md:w-28 z-20" src={hexagon2} alt="" />
                        <p className='absolute z-30 flex justify-center w-24 md:w-28 top-1/2 transform -translate-y-1/2 text-base md:text-xl text-pj-white'>Beehive</p>
                    </Link>

                    <Link to={'/about'} className='relative w-24 md:w-28 cursor-pointer hover:translate-x-1 transition ease-in-out duration-200'>
                        <img className="w-24 md:w-28 z-20" src={hexagon} alt="" />
                        <p className='absolute z-30 flex justify-center w-24 md:w-28 top-1/2 transform -translate-y-1/2 text-base md:text-xl text-pj-primary'>About</p>
                    </Link>
            </div>

          
            <div className='grid grid-flow-col col-span-2 w-fit -mt-5 gap-2'>
                <Link to={'/works'} className='relative w-24 md:w-28 cursor-pointer hover:-translate-x-1 hover:translate-y-1 transition ease-in-out duration-200'>
                    <img className="w-24 md:w-28 z-20" src={hexagon} alt="" />
                    <p className='absolute z-30 flex justify-center w-24 md:w-28 top-1/2 transform -translate-y-1/2 text-base md:text-xl text-pj-primary'>Works</p>
                </Link>
            
                <Link to={'/contact'} className='relative w-24 md:w-28 cursor-pointer hover:translate-x-1 hover:translate-y-1 transition ease-in-out duration-200'>
                    <img className="w-24 md:w-28 z-20" src={hexagon} alt="" />
                    <p className='absolute z-30 flex justify-center w-24 md:w-28 top-1/2 transform -translate-y-1/2 text-base md:text-xl text-pj-primary leading-tight'>Contact</p>
                </Link>
            </div>
          
          
        </div>

    </div>
    )
}