"use client"
import React, {ReactElement, useEffect, useRef, useState} from "react";
import chariot from "../../public/images/SVGs/chariot.svg"
import crownSword from "../../public/images/SVGs/sword_crown.svg"
import bee2 from '../../public/images/SVGs/bee2.svg'
import logo from '../../public/images/logo.png'
import Image from "next/image";
import {LiveBGStatic} from "@/Components/LiveBG";
import Link from "next/link";

type LayoutPropsType = {
		children: ReactElement | ReactElement[],
		title: string,
		description?: string,
		backLink: string | null,
		logoShow?: boolean,
		lgLogoShow?: boolean,
}

export default function LayoutOutline({
																					children,
																					title = 'Home',
																					description = '',
																					backLink,
																					lgLogoShow = true,
																					logoShow = true,
																			}: LayoutPropsType) {
		
		const [isOpen, setIsOpen] = useState(false); // State to track if the div is active/open
		const divRef = useRef<HTMLDivElement | null>(null); // Ref for the target div
		
		const handleClickOutside = (event: MouseEvent) => {
				// Check if the clicked element is outside the div
				if (divRef.current && !divRef.current.contains(event.target as Node)) {
						setIsOpen(false); // Close the div (or change the state)
				}
		};
		
		useEffect(() => {
				// Add event listener for clicks on the document
				document.addEventListener("mousedown", handleClickOutside);
				
				return () => {
						// Clean up the event listener
						document.removeEventListener("mousedown", handleClickOutside);
				};
		}, []);
		
		return (
				<main className="h-dvh w-full overflow-hidden font-pj-font">
						<div className="w-full h-full bg-pj-dark grid grid-rows-12 relative">
								{
										typeof backLink === 'string' && (
												<Link
														href={backLink}
														className={'fill-pj-primary absolute w-10 h-10 top-0 left-0 z-20 mx-4 md:mx-10 my-5 cursor-pointer hover:fill-pj-secondary'}
												>
														<svg
																
																className="fill-inherit"
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 512 512"
														>
																<path
																		d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"
																/>
														</svg>
												</Link>
										)
								}
								
								<div
										className={`h-full relative ${isOpen && 'z-[60]' || 'z-10'} row-span-2 grid grid-flow-col grid-cols-3`}>
										<div className={`flex justify-center items-start`}>
												<Image className='w-8/12 md:w-3/12' src={bee2} alt=""/>
										</div>
										<div className={`grid justify-items-center mt-5`}>
												{
														logoShow &&
                            <Image className={`${!lgLogoShow && 'lg:hidden'} w-2/4 md:w-1/3 xl:w-1/5`} src={logo}
                                   alt=""
                            />
												}
												
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
												{
														typeof backLink !== 'string' ?
																<Image
																		className={`w-3/5 md:w-1/4 absolute z-10 top-0 right-0`}
																		src={crownSword} alt=""
																/> :
																<div
																		className={`pt-4 px-4 mx-3 h-fit relative`}
																		ref={divRef}
																>
																		<button
																				onClick={() => {
																						setIsOpen(!isOpen)
																				}}
																				className={`px-4 md:px-8 py-1.5 md:py-2 h-fit border border-pj-secondary bg-pj-secondary text-pj-accent font-semibold rounded hover:scale-105 hover:bg-pj-accent hover:text-pj-secondary transition-all duration-300`}>
																				Go to
																		</button>
																		<div
																				
																				className={`w-full ${isOpen ? 'visible h-44' : 'invisible h-0'} py-2 bg-pj-secondary text-pj-accent absolute z-[60] top-full left-0 my-2 text-center rounded transition-all duration-300`}
																		>
																				<div className={'grid gap-y-0.5'}>
																						<Link className={'hover:underline w-full'}
																									href={`/`}>Home</Link>
																						<Link className={'hover:underline w-full'}
																									href={`/works`}>Works</Link>
																						<Link className={'hover:underline w-full'}
																									href={`/team`}>Team</Link>
																						<Link className={'hover:underline w-full'}
																									href={`/prices`}>Prices</Link>
																						<Link className={'hover:underline w-full'}
																									href={`/about`}>About</Link>
																						<Link className={'hover:underline w-full'}
																									href={`/contact`}>Contact</Link>
																				</div>
																		</div>
																</div>
												}
										</div>
								</div>
								<div className={`row-span-10`}>
										{children}
										<LiveBGStatic/>
								</div>
								<div className={`absolute z-0 w-full -bottom-2 md:-bottom-16 ml-3 mr-auto`}>
										<div className={`relative flex sm:w-1/2 md:w-2/5 lg:w-1/3 `}>
												<Image className='w-1/2 -scale-x-[1]' src={chariot} alt=""/>
										</div>
								</div>
								<div className={`row-span-1 self-end`}>
										<p className='text-sm mx-auto py-5 bottom-1 md:bottom-6 text-pj-primary w-max z-50'>
												©{new Date().getFullYear()} Copyright - Doxa Innovations PLC</p>
								</div>
						</div>
				</main>
		)
}