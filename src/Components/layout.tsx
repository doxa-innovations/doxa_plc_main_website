import {ReactElement} from "react";
import honeyCone from '../../public/images/SVGs/honeycone.svg'
import honeyCone2 from '../../public/images/SVGs/honeycone2.svg'
import bee2 from '../../public/images/SVGs/bee2.svg'
import bee3 from '../../public/images/SVGs/bee3.svg'
import logo from '../../public/images/logo.png'
import {useNavigate} from "react-router";
import {Helmet} from "react-helmet";


type propsType = {
		children: ReactElement,
		title: string,
		link: string | null,
		logoShow?: boolean,
		lgLogoShow?: boolean,
}

function Layout({children, title = 'Home', link, lgLogoShow = true, logoShow = true}: propsType): ReactElement {
		
		const navigate = useNavigate();
		
		return (
				<main className="h-dvh w-full overflow-hidden">
						<Helmet>
								<title>{title} - Bee Design</title>
						</Helmet>
						<div className="w-full h-full bg-pj-light-Dark grid grid-rows-12 relative">
								{
										typeof link === 'string' && (
												<div
														className={'fill-pj-primary absolute w-10 h-10 top-0 left-0 z-50 mx-4 md:mx-10 my-5 cursor-pointer hover:fill-pj-secondary'}
												>
														<svg
																onClick={() => {
																		navigate(link);
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
								
								<div className={`h-full row-span-2 grid grid-flow-col grid-cols-3`}>
										<div className={`flex md:justify-center items-start`}>
												<img className='w-8/12 md:w-3/12' src={bee2} alt=""/>
										</div>
										<div className={`grid justify-items-center mt-8`}>
												{logoShow && <img className={`${!lgLogoShow && 'lg:hidden'} w-full md:w-2/3 lg:w-2/4`} src={logo} alt=""/>}
										</div>
										<div className={`h-full grid justify-end relative`}>
												<img className={'md:w-3/5 absolute -top-[35%] -right-[15%] md:-top-[55%] lg:-top-[50%]'}
														 src={honeyCone} alt=""/>
										</div>
								</div>
								<div className={`row-span-10 `}>
										{children}
								</div>
								<div className={`absolute z-0 w-full top-2/3 sm:top-1/2 bottom-1/2 m-auto`}>
										<div className={`relative flex sm:w-1/2 md:w-2/5 lg:w-1/3 `}>
												<img className='w-4/12' src={honeyCone2} alt=""/>
												<img className='w-4/12 -ml-12 mb-5' src={bee3} alt=""/>
										</div>
								</div>
								<div className={`row-span-1 self-end`}>
										<p className='text-sm mx-auto py-5 bottom-6 text-pj-primary w-max z-50'>
												©{new Date().getFullYear()} Copyright - Bee Design Studio</p>
								</div>
						</div>
				</main>
		)
}

export default Layout;
