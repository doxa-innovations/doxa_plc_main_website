import {ReactElement} from "react";
import {Link} from "react-router-dom";
import hexagon from '../../public/images/SVGs/hexagon.svg';
import hexagon2 from '../../public/images/SVGs/hexagon2.svg';
import Layout from "../Components/Layout.tsx";


export const Home = () : ReactElement=>{
		
		return (
				<Layout title={'Home'} backLink={null} lgLogoShow={true}>
						<div className={`h-full flex flex-col mt-5 md:mt-10 gap-5 z-50 relative`}>
								<h1 className='text-4xl md:text-5xl text-pj-white text-center leading-[140%] md:leading-[120%]'>
										Working Hard Like A <br/> <strong className=' text-pj-primary text-4xl md:text-5xl'>Bee</strong>
								</h1>
								<div className='flex flex-col items-center mt-2 md:mt-0 relative z-50'>
										<div className='grid grid-flow-col col-span-2 w-fit -mb-5 md:-mb-4 gap-2'>
												<Link to={'/services'}
															className='relative w-24 md:w-28 cursor-pointer hover:-translate-x-1 hover:-translate-y-1 transition ease-in-out duration-200'>
														<img className="w-24 md:w-28 z-20" src={hexagon} alt=""/>
														<p className='absolute z-30 flex justify-center w-24 md:w-28 top-1/2 transform -translate-y-1/2 text-base md:text-xl text-pj-primary'>Services</p>
												</Link>
												
												<Link to={'/prices'}
															className='relative w-24 md:w-28 cursor-pointer hover:translate-x-1 hover:-translate-y-1 transition ease-in-out duration-200'>
														<img className="w-24 md:w-28 z-20" src={hexagon} alt=""/>
														<p className='absolute z-30 flex justify-center w-24 md:w-28 top-1/2 transform -translate-y-1/2 text-base md:text-xl text-pj-primary'>Prices</p>
												</Link>
										</div>
										<div className='grid grid-flow-col col-span-3 gap-2'>
												<Link to={'/team'}
															className='relative w-24 md:w-28 cursor-pointer hover:-translate-x-1 transition ease-in-out duration-200'>
														<img className="w-24 md:w-28 z-20" src={hexagon} alt=""/>
														<p className='absolute z-30 flex justify-center w-24 md:w-28 top-1/2 transform -translate-y-1/2 text-base md:text-xl text-pj-primary'>Team</p>
												</Link>
												
												<Link to={''}
															className='relative w-24 md:w-28 cursor-pointer hover:scale-90 transition ease-in-out duration-200'>
														<img className="w-24 md:w-28 z-20" src={hexagon2} alt=""/>
														<p className='absolute z-30 flex justify-center w-24 md:w-28 top-1/2 transform -translate-y-1/2 text-base md:text-xl text-pj-white'>Beehive</p>
												</Link>
												
												<Link to={'/about'}
															className='relative w-24 md:w-28 cursor-pointer hover:translate-x-1 transition ease-in-out duration-200'>
														<img className="w-24 md:w-28 z-20" src={hexagon} alt=""/>
														<p className='absolute z-30 flex justify-center w-24 md:w-28 top-1/2 transform -translate-y-1/2 text-base md:text-xl text-pj-primary'>About</p>
												</Link>
										</div>
										<div className='grid grid-flow-col col-span-2 w-fit -mt-5 gap-2'>
												<Link to={'/works'}
															className='relative w-24 md:w-28 cursor-pointer hover:-translate-x-1 hover:translate-y-1 transition ease-in-out duration-200'>
														<img className="w-24 md:w-28 z-20" src={hexagon} alt=""/>
														<p className='absolute z-30 flex justify-center w-24 md:w-28 top-1/2 transform -translate-y-1/2 text-base md:text-xl text-pj-primary'>Works</p>
												</Link>
												
												<Link to={'/contact'}
															className='relative w-24 md:w-28 cursor-pointer hover:translate-x-1 hover:translate-y-1 transition ease-in-out duration-200'>
														<img className="w-24 md:w-28 z-20" src={hexagon} alt=""/>
														<p className='absolute z-30 flex justify-center w-24 md:w-28 top-1/2 transform -translate-y-1/2 text-base md:text-xl text-pj-primary leading-tight'>Contact</p>
												</Link>
										</div>
								</div>
						</div>
				</Layout>
		)
}