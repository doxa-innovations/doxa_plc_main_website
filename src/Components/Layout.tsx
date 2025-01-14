import {ReactElement} from "react";
import bee2 from '../../public/images/SVGs/bee2.svg'
import logo from '../../public/images/logo.png'
import {useNavigate} from "react-router";
import {Helmet} from "react-helmet";
import chariot from "../../public/images/SVGs/chariot.svg"
import crownSword from "../../public/images/SVGs/sword_crown.svg"

type propsType = {
		children: ReactElement | ReactElement[],
		title: string,
		description?: string,
		backLink: string | null,
		logoShow?: boolean,
		lgLogoShow?: boolean,
}

function Layout({
										children,
										title = 'Home',
										description = '',
										backLink,
										lgLogoShow = true,
										logoShow = true
								}: propsType): ReactElement {
		
		const navigate = useNavigate();
		
		
		return (
				<main className="h-dvh w-full overflow-hidden font-pj-font">
						<Helmet>
								<title>{title} - Doxa Innovations</title>
						</Helmet>
						<div className="w-full h-full bg-pj-dark grid grid-rows-12 relative">
								{
										typeof backLink === 'string' && (
												<div
														className={'fill-pj-primary absolute w-10 h-10 top-0 left-0 z-20 mx-4 md:mx-10 my-5 cursor-pointer hover:fill-pj-secondary'}
												>
														<svg
																onClick={() => {
																		navigate(backLink);
																}}
																className="fill-inherit"
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 512 512"
														>
																<path
																		d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"
																/>
														</svg>
												</div>
										
										)
								}
								
								<div className={`h-full relative z-10 row-span-2 grid grid-flow-col grid-cols-3`}>
										<div className={`flex justify-end md:justify-center items-start`}>
												<img className='w-8/12 md:w-3/12' src={bee2} alt=""/>
										</div>
										<div className={`grid justify-items-center mt-5`}>
												{logoShow &&
                            <img className={`${!lgLogoShow && 'lg:hidden'} w-2/4 md:w-1/3 xl:w-1/5`} src={logo}
                                 alt=""/>}
												
												{
														!lgLogoShow &&
                            <div className={`py-4 text-center w-full`}>
                                <h1 className='text-2xl sm:text-2xl lg:text-6xl font-bold text-pj-primary text-center'>
																		{title}
                                </h1>
                                <h2 className="text-pj-white font-medium ">
																		{description}
                                </h2>
                            </div>
												}
										</div>
										<div className={`h-full grid justify-end relative`}>
												<img
														className={'w-2/3 p-3 md:p-0 md:w-1/4 absolute z-10 top-0 right-0'}
														src={crownSword} alt=""
												/>
										</div>
								</div>
								<div className={`row-span-10`}>
										{children}
								</div>
								<div className={`absolute z-0 w-full -bottom-16 ml-3 mr-auto`}>
										<div className={`relative flex sm:w-1/2 md:w-2/5 lg:w-1/3 `}>
												<img className='w-1/2 -scale-x-[1]' src={chariot} alt=""/>
										</div>
								</div>
								<div className={`row-span-1 self-end`}>
										<p className='text-sm mx-auto py-5 bottom-1 md:bottom-6 text-pj-primary w-max z-50'>
												©{new Date().getFullYear()} Copyright - Doxa Innovations PLC
										</p>
								</div>
						</div>
				</main>
		)
}

export default Layout;
