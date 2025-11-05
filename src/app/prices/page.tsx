"use client"
import {ReactElement, useEffect, useState} from "react";
import Link from "next/link";
import LayoutOutline from "@/app/_LayoutOutline";
import {Loading} from "@/Components/Loading";


export default function Prices(): ReactElement {
	
	const [showing, setShowing] = useState<string | null>(null);
	const [isEthiopian, setIsEthiopian] = useState<boolean | null>(null);
	
	useEffect(() => {
		const fetchLocation = async () => {
			try {
				// Replace with your chosen IP Geolocation API
				const data = await fetch('https://ipapi.co/json/').then((response) => {
					return response.json();
				}).catch((e) => {
					console.log(e)
				}); // Example API
				
				if (data.country_code === 'ET') {
					setIsEthiopian(true);
				} else {
					setIsEthiopian(false);
				}
			} catch (error) {
				console.error('Error fetching geolocation data:', error);
				setIsEthiopian(false);
			}
		};
		
		fetchLocation().then(() => null);
	}, []);
	
	return (
		<LayoutOutline
			title={'Prices'}
			description={`Our Plans and Packages`}
			backLink={'/'}
			lgLogoShow={false}
		>
			<div className="h-full pt-20 md:pt-0 relative overflow-y-scroll scrollbar">
				<div
					className={`w-full h-full px-10 flex flex-wrap gap-x-5 gap-y-6 md:gap-y-2 justify-center items-center relative z-50 `}>
					<div
						className={`w-full sm:w-[21rem] md:w-3/12 h-fit min-h-[500px] bg-pj-accent text-pj-white py-3 px-5 mx-auto md:mx-0 rounded-lg hover:-translate-y-2 transition duration-500`}
					>
						<div className="flex items-center pt-3 pb-5">
							<svg className="w-10 h-10 fill-pj-white mr-4" xmlns="http://www.w3.org/2000/svg"
								 viewBox="0 0 576 512">
								<path
									d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z"/>
							</svg>
							<div>
								<h3 className="text-xl md:text-2xl font-semibold">Static <span
									className="font-light">Website</span></h3>
								<p className="text-sm ">Upto 5 Pages</p>
							</div>
						</div>
						
						<div>
							<p className="text-sm text-start">
								Informatory website built with HTML, CSS and fair use of Javascript to notify customers
								of
								your business...
							</p>
							
							<h4 className={'text-4xl w-full border-b border-pj-secondary text-end pt-3 py-3 font-bold'}>
								{
									isEthiopian !== null ?
										(!isEthiopian && <>
                                            <span className="text-base mx-1">Starting From</span>
                                            1,500
                                            <span className="text-base mx-1">
																								USD
																						</span>
                                        </>) :
										<Loading color={'text-pj-secondary'}/>
								}
							</h4>
							<ul className="px-3 pt-3">
								<li className="flex gap-1 items-center mb-2">
									<svg className="w-4 h-4 fill-pj-white" xmlns="http://www.w3.org/2000/svg"
										 viewBox="0 0 512 512">
										<path
											d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
									</svg>
									<p className="text-sm">Website Design Included</p>
								</li>
								<li className="flex gap-1 items-center my-2">
									<svg className="w-4 h-4 fill-pj-white" xmlns="http://www.w3.org/2000/svg"
										 viewBox="0 0 512 512">
										<path
											d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
									</svg>
									<p className="text-sm">Clean & Responsive Design</p>
								</li>
								<li className="flex gap-1 items-center my-2">
									<svg className="w-4 h-4 fill-pj-white" xmlns="http://www.w3.org/2000/svg"
										 viewBox="0 0 512 512">
										<path
											d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
									</svg>
									<p className="text-sm">Basic Contact Forms</p>
								</li>
								<li className="flex gap-1 items-center my-2">
									<svg className="w-4 h-4 fill-pj-white" xmlns="http://www.w3.org/2000/svg"
										 viewBox="0 0 512 512">
										<path
											d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
									</svg>
									<p className="text-sm">Image Optimization</p>
								</li>
								<li className="flex gap-1 items-center my-2">
									<svg className="w-4 h-4 fill-pj-white" xmlns="http://www.w3.org/2000/svg"
										 viewBox="0 0 512 512">
										<path
											d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
									</svg>
									<p className="text-sm">Basic SEO</p>
								</li>
								<li className="flex gap-1 items-center my-2">
									<svg className="w-4 h-4 fill-pj-white" xmlns="http://www.w3.org/2000/svg"
										 viewBox="0 0 512 512">
										<path
											d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
									</svg>
									<p className="text-sm flex items-center gap-0.5">
										FREE 1 Year Warranty
										<span
											title="If you enter our Subcription package we will provide unlimited warranty."
										>
																						<svg
																							className="w-3 h-3 fill-pj-white cursor-pointer"
																							xmlns="http://www.w3.org/2000/svg"
																							viewBox="0 0 512 512"><path
																							d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
																						</svg>
                            						</span>
									</p>
								</li>
							</ul>
							
							<div className={`pb-1 pt-2 grid place-items-center`}>
								<Link
									href={'/contact'}
									className="px-8 py-2 w-44 mx-auto text-center mb-2 mt-4 bg-pj-secondary text-pj-accent rounded-full cursor-pointer hover:bg-pj-accent hover:border border-pj-white hover:text-pj-white duration-300"
								>
									Contact Us
								</Link>
							</div>
						
						</div>
					</div>
					
					<div
						className={`w-full sm:w-[21rem] md:w-3/12 h-fit min-h-[500px] bg-pj-secondary text-pj-accent py-3 px-5 mx-auto md:mx-0 rounded-lg hover:-translate-y-2 transition duration-500`}
					>
						<div className="flex items-center pt-3 pb-5">
							<svg className="w-10 h-10 fill-pj-accent mr-2" xmlns="http://www.w3.org/2000/svg"
								 viewBox="0 0 512 512">
								<path
									d="M192 32c0 17.7 14.3 32 32 32c123.7 0 224 100.3 224 224c0 17.7 14.3 32 32 32s32-14.3 32-32C512 128.9 383.1 0 224 0c-17.7 0-32 14.3-32 32zm0 96c0 17.7 14.3 32 32 32c70.7 0 128 57.3 128 128c0 17.7 14.3 32 32 32s32-14.3 32-32c0-106-86-192-192-192c-17.7 0-32 14.3-32 32zM96 144c0-26.5-21.5-48-48-48S0 117.5 0 144L0 368c0 79.5 64.5 144 144 144s144-64.5 144-144s-64.5-144-144-144l-16 0 0 96 16 0c26.5 0 48 21.5 48 48s-21.5 48-48 48s-48-21.5-48-48l0-224z"/>
							</svg>
							<div>
								<h3 className="text-xl md:text-2xl font-semibold">Blog Post <span
									className="font-light">Website</span></h3>
								<p className="text-sm ">Upto 2 Custom Designs</p>
							</div>
						</div>
						
						<div>
							<p className="text-sm text-start">
								Take control the content shown on your website for better engagement, blog post and etc
								...
							</p>
							
							<h4 className={'text-4xl w-full border-b border-pj-accent text-end pt-3 py-3 font-bold'}>
								{
									isEthiopian !== null ?
										(!isEthiopian && <>
                                            <span className="text-base mx-1">Starting From</span>
                                            4,000
                                            <span className="text-base mx-1">
																								USD
																						</span>
                                        </>) :
										<Loading color={'text-pj-accent'}/>
								}
							</h4>
							<ul className="px-3 pt-3">
								<li className="flex gap-1 items-center mb-2">
									<svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg"
										 viewBox="0 0 512 512">
										<path
											d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
									</svg>
									<p className="text-sm">Clean & Responsive Design</p>
								</li>
								<li className="flex gap-1 items-center my-2">
									<svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg"
										 viewBox="0 0 512 512">
										<path
											d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
									</svg>
									<p className="text-sm">CMS Admin Panel</p>
								</li>
								<li className="flex gap-1 items-center my-2">
									<svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg"
										 viewBox="0 0 512 512">
										<path
											d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
									</svg>
									<p className="text-sm">Custom Forms</p>
								</li>
								<li className="flex gap-1 items-center my-2">
									<svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg"
										 viewBox="0 0 512 512">
										<path
											d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
									</svg>
									<p className="text-sm">Blog Post</p>
								</li>
								<li className="flex gap-1 items-center my-2">
									<svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg"
										 viewBox="0 0 512 512">
										<path
											d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
									</svg>
									<p className="text-sm">Advanced SEO</p>
								</li>
								<li className="flex gap-1 items-center my-2">
									<svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg"
										 viewBox="0 0 512 512">
										<path
											d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
									</svg>
									<p className="text-sm">FREE 1 Year Domain & Hosting</p>
								</li>
								<li className="flex gap-1 items-center my-2">
									<svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg"
										 viewBox="0 0 512 512">
										<path
											d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
									</svg>
									<p className="text-sm flex items-center gap-0.5">
										FREE 1 Year Warranty
										<span
											title="If you enter our Subcription package we will provide unlimited warranty.">
                                <svg className="w-3 h-3 fill-pj-accent cursor-pointer"
									 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path
									d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                            </span>
									</p>
								</li>
							</ul>
							
							<div className={`pb-1 pt-2 grid place-items-center`}>
								<Link
									href={'/contact'}
									className="px-8 py-2 w-44 mx-auto text-center mb-2 mt-4 bg-pj-accent text-pj-white rounded-full cursor-pointer hover:bg-transparent hover:border border-pj-accent hover:text-pj-accent duration-300"
								>
									Contact Us
								</Link>
							</div>
						
						</div>
					</div>
					
					<div
						className={`w-full sm:w-[21rem] md:w-3/12 h-fit min-h-[500px] bg-pj-secondary text-pj-accent py-3 px-5 mx-auto md:mx-0 rounded-lg hover:-translate-y-2 transition duration-500`}
					>
						<div className="flex items-center pt-3 pb-5">
							<svg className="w-10 h-10 fill-pj-accent mr-1" xmlns="http://www.w3.org/2000/svg"
								 viewBox="0 0 640 512">
								<path
									d="M353.8 54.1L330.2 6.3c-3.9-8.3-16.1-8.6-20.4 0L286.2 54.1l-52.3 7.5c-9.3 1.4-13.3 12.9-6.4 19.8l38 37-9 52.1c-1.4 9.3 8.2 16.5 16.8 12.2l46.9-24.8 46.6 24.4c8.6 4.3 18.3-2.9 16.8-12.2l-9-52.1 38-36.6c6.8-6.8 2.9-18.3-6.4-19.8l-52.3-7.5zM256 256c-17.7 0-32 14.3-32 32V480c0 17.7 14.3 32 32 32H384c17.7 0 32-14.3 32-32V288c0-17.7-14.3-32-32-32H256zM32 320c-17.7 0-32 14.3-32 32V480c0 17.7 14.3 32 32 32H160c17.7 0 32-14.3 32-32V352c0-17.7-14.3-32-32-32H32zm416 96v64c0 17.7 14.3 32 32 32H608c17.7 0 32-14.3 32-32V416c0-17.7-14.3-32-32-32H480c-17.7 0-32 14.3-32 32z"/>
							</svg>
							<div>
								<h3 className="text-xl md:text-2xl font-semibold">Business Starter <span
									className="font-light">Package</span></h3>
								<p className="text-sm ">Business Kit</p>
							</div>
						</div>
						
						<div>
							<p className="text-sm text-start">
								Boost your business&#39;s outreach...
							</p>
							<h4 className={'text-4xl w-full border-b border-pj-accent text-end pt-3 py-3 font-bold'}>
								{
									isEthiopian !== null ?
										(!isEthiopian && <>
                                            <span className="text-base mx-1">Starting From</span>
                                            10,000
                                            <span className="text-base mx-1">
																								USD
																						</span>
                                        </>) :
										<Loading color={'text-pj-accent'}/>
								}
							</h4>
							<ul className="px-3 pt-3">
								<li className="flex gap-1 items-center mb-2">
									<svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg"
										 viewBox="0 0 512 512">
										<path
											d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
									</svg>
									<p className="text-sm">Clean & Responsive Informatory Website</p>
								</li>
								<li className="flex gap-1 items-center my-2">
									<svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg"
										 viewBox="0 0 512 512">
										<path
											d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
									</svg>
									<p className="text-sm">Logo Design and Branding</p>
								</li>
								<li className="flex gap-1 items-center my-2">
									<svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg"
										 viewBox="0 0 512 512">
										<path
											d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
									</svg>
									<p className="text-sm">Business Cards and Fliers</p>
								</li>
								<li className="flex gap-1 items-center my-2">
									<svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg"
										 viewBox="0 0 512 512">
										<path
											d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
									</svg>
									<p className="text-sm">Marketing Materials</p>
								</li>
								<li className="flex gap-1 items-center my-2">
									<svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg"
										 viewBox="0 0 512 512">
										<path
											d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
									</svg>
									<p className="text-sm">Social Media Integration</p>
								</li>
								<li className="flex gap-1 items-center my-2">
									<svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg"
										 viewBox="0 0 512 512">
										<path
											d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
									</svg>
									<p className="text-sm">FREE Setup and Networking</p>
								</li>
								<li className="flex gap-1 items-center my-2">
									<svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg"
										 viewBox="0 0 512 512">
										<path
											d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
									</svg>
									<p className="text-sm">FREE 1 Year Domain & Hosting</p>
								</li>
								<li className="flex gap-1 items-center my-2">
									<svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg"
										 viewBox="0 0 512 512">
										<path
											d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
									</svg>
									<p className="text-sm flex items-center gap-0.5">
										FREE 1 Year Warranty
										<span
											title="If you enter our Subcription package we will provide unlimited warranty.">
																						<svg
																							className="w-3 h-3 fill-pj-accent cursor-pointer"
																							xmlns="http://www.w3.org/2000/svg"
																							viewBox="0 0 512 512"><path
																							d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
																				</span>
									</p>
								</li>
							</ul>
							
							<div className={`pb-1 pt-2 grid place-items-center`}>
								<Link
									href={'/contact'}
									className="px-8 py-2 w-44 mx-auto text-center mb-2 mt-4 bg-pj-accent text-pj-white rounded-full cursor-pointer hover:bg-transparent hover:border border-pj-accent hover:text-pj-accent duration-300"
								>
									Contact Us
								</Link>
							</div>
						</div>
					</div>
					
					<div
						className="grid items-end w-fit md:w-5/12 mx-5 py-2">
						<button onClick={() => {
							setShowing('custom')
						}}
								className="w-full px-10 py-5 h-12 text-sm md:text-lg mx-auto bg-pj-accent text-pj-white grid place-content-center rounded-lg cursor-pointer hover:bg-opacity-90 duration-200"
						>
							Looking for Something Powerful?
						</button>
					</div>
				</div>
			</div>
			
			<div className={`${showing === null && 'invisible'} w-full h-full absolute bottom-0 z-50`}>
				<div className={`w-full h-full relative`}>
					<div
						className={`w-full h-full bg-pj-light-Dark opacity-80 absolute z-10`}
						onClick={() => {
							setShowing(null)
						}}
					></div>
					<div
						className={`${showing === null && 'h-0' || 'h-[90%] lg:h-4/5'} w-full bg-pj-accent absolute bottom-0 z-50 transition-all duration-800 overflow-x-hidden overflow-y-scroll scrollbar`}>
						<div className={`relative w-full h-full bottom-0 px-2`}>
							<div
								className={`grid place-items-center h-16 border-b border-pj-secondary sticky top-0 bg-pj-accent`}>
								<p className={`text-2xl md:text-3xl text-white`}>
									Custom Builds
								</p>
								<div
									className={`absolute w-6 fill-pj-primary top-0 right-0 mt-4 mr-4 z-50 cursor-pointer
																				hover:scale-[1.05] hover:fill-pj-secondary transition-all duration-800`}
									onClick={() => {
										setShowing(null)
									}}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 512 512"
									>
										<path
											d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/>
									</svg>
								</div>
							</div>
							<div
								className={`flex flex-wrap justify-center items-center p-5 lg:py-10`}
							>
								<div
									className="w-full h-3/4 md:h-auto lg:w-1/2 text-pj-white px-3 pb-4 md:px-6 border-b-2 lg:border-b-0 lg:border-r-2 border-pj-secondary">
									<div
										className="text-xl md:text-3xl text-pj-secondary font-semibold py-2  flex items-center justify-center">
										Custom Software and Apps
									</div>
									<p className="">
										We provide specialized packages for businesses in need of custom web
										applications to
										streamline operations and improve efficiency. Our services include:
									</p>
									<ul className={`py-6 grid gap-2 md:gap-4 ml-5 list-disc`}>
										<li>
											<span className={`font-bold`}>Telegram Bots:</span> Automate customer
											interactions and operational tasks.
										</li>
										<li>
											<span className={`font-bold`}>eCommerce Apps:</span> Build scalable and
											user-friendly online stores.
										</li>
										<li>
											<span className={`font-bold`}>ERP Systems:</span> Manage business processes
											like
											finance and inventory from a single platform.
										</li>
										<li>
											<span className={`font-bold`}>Management Apps:</span> Simplify team
											collaboration and project tracking.
										</li>
										<li>
											<span className={`font-bold`}>Custom Solutions:</span> Unique tools designed
											to
											meet your specific business needs.
										</li>
									</ul>
									<p className="">
										With our expertise, you’ll get reliable, secure, and cost-effective solutions
										tailored to help your business succeed.
									</p>
									<h4 className="pr-2 mt-5 text-sm md:text-base text-center">
										It comes with <span
										className={`text-xl md:text-2xl underline font-bold`}>Custom Pricing</span> Fitting
										Your Business Needs</h4>
								</div>
								<div className={`w-full py-10 h-1/4 lg:w-1/2 dear-container`}>
									<svg className="machine fill-pj-secondary" xmlns="http://www.w3.org/2000/svg"
										 x="0px"
										 y="0px"
										 viewBox="0 0 645 526">
										<defs/>
										<g>
											<path x="-173,694" y="-173,694" className="large-shadow"
												  d="M645 194v-21l-29-4c-1-10-3-19-6-28l25-14 -8-19 -28 7c-5-8-10-16-16-24L602 68l-15-15 -23 17c-7-6-15-11-24-16l7-28 -19-8 -14 25c-9-3-18-5-28-6L482 10h-21l-4 29c-10 1-19 3-28 6l-14-25 -19 8 7 28c-8 5-16 10-24 16l-23-17L341 68l17 23c-6 7-11 15-16 24l-28-7 -8 19 25 14c-3 9-5 18-6 28l-29 4v21l29 4c1 10 3 19 6 28l-25 14 8 19 28-7c5 8 10 16 16 24l-17 23 15 15 23-17c7 6 15 11 24 16l-7 28 19 8 14-25c9 3 18 5 28 6l4 29h21l4-29c10-1 19-3 28-6l14 25 19-8 -7-28c8-5 16-10 24-16l23 17 15-15 -17-23c6-7 11-15 16-24l28 7 8-19 -25-14c3-9 5-18 6-28L645 194zM471 294c-61 0-110-49-110-110S411 74 471 74s110 49 110 110S532 294 471 294z"/>
										</g>
										<g>
											<path x="-136,996" y="-136,996" className="medium-shadow"
												  d="M402 400v-21l-28-4c-1-10-4-19-7-28l23-17 -11-18L352 323c-6-8-13-14-20-20l11-26 -18-11 -17 23c-9-4-18-6-28-7l-4-28h-21l-4 28c-10 1-19 4-28 7l-17-23 -18 11 11 26c-8 6-14 13-20 20l-26-11 -11 18 23 17c-4 9-6 18-7 28l-28 4v21l28 4c1 10 4 19 7 28l-23 17 11 18 26-11c6 8 13 14 20 20l-11 26 18 11 17-23c9 4 18 6 28 7l4 28h21l4-28c10-1 19-4 28-7l17 23 18-11 -11-26c8-6 14-13 20-20l26 11 11-18 -23-17c4-9 6-18 7-28L402 400zM265 463c-41 0-74-33-74-74 0-41 33-74 74-74 41 0 74 33 74 74C338 430 305 463 265 463z"/>
										</g>
										<g>
											<path x="-100,136" y="-100,136" className="small-shadow"
												  d="M210 246v-21l-29-4c-2-10-6-18-11-26l18-23 -15-15 -23 18c-8-5-17-9-26-11l-4-29H100l-4 29c-10 2-18 6-26 11l-23-18 -15 15 18 23c-5 8-9 17-11 26L10 225v21l29 4c2 10 6 18 11 26l-18 23 15 15 23-18c8 5 17 9 26 11l4 29h21l4-29c10-2 18-6 26-11l23 18 15-15 -18-23c5-8 9-17 11-26L210 246zM110 272c-20 0-37-17-37-37s17-37 37-37c20 0 37 17 37 37S131 272 110 272z"/>
										</g>
										<g>
											<path x="-100,136" y="-100,136" className="small"
												  d="M200 236v-21l-29-4c-2-10-6-18-11-26l18-23 -15-15 -23 18c-8-5-17-9-26-11l-4-29H90l-4 29c-10 2-18 6-26 11l-23-18 -15 15 18 23c-5 8-9 17-11 26L0 215v21l29 4c2 10 6 18 11 26l-18 23 15 15 23-18c8 5 17 9 26 11l4 29h21l4-29c10-2 18-6 26-11l23 18 15-15 -18-23c5-8 9-17 11-26L200 236zM100 262c-20 0-37-17-37-37s17-37 37-37c20 0 37 17 37 37S121 262 100 262z"/>
										</g>
										<g>
											<path x="-173,694" y="-173,694" className="large"
												  d="M635 184v-21l-29-4c-1-10-3-19-6-28l25-14 -8-19 -28 7c-5-8-10-16-16-24L592 58l-15-15 -23 17c-7-6-15-11-24-16l7-28 -19-8 -14 25c-9-3-18-5-28-6L472 0h-21l-4 29c-10 1-19 3-28 6L405 9l-19 8 7 28c-8 5-16 10-24 16l-23-17L331 58l17 23c-6 7-11 15-16 24l-28-7 -8 19 25 14c-3 9-5 18-6 28l-29 4v21l29 4c1 10 3 19 6 28l-25 14 8 19 28-7c5 8 10 16 16 24l-17 23 15 15 23-17c7 6 15 11 24 16l-7 28 19 8 14-25c9 3 18 5 28 6l4 29h21l4-29c10-1 19-3 28-6l14 25 19-8 -7-28c8-5 16-10 24-16l23 17 15-15 -17-23c6-7 11-15 16-24l28 7 8-19 -25-14c3-9 5-18 6-28L635 184zM461 284c-61 0-110-49-110-110S401 64 461 64s110 49 110 110S522 284 461 284z"/>
										</g>
										<g>
											<path x="-136,996" y="-136,996" className="medium"
												  d="M392 390v-21l-28-4c-1-10-4-19-7-28l23-17 -11-18L342 313c-6-8-13-14-20-20l11-26 -18-11 -17 23c-9-4-18-6-28-7l-4-28h-21l-4 28c-10 1-19 4-28 7l-17-23 -18 11 11 26c-8 6-14 13-20 20l-26-11 -11 18 23 17c-4 9-6 18-7 28l-28 4v21l28 4c1 10 4 19 7 28l-23 17 11 18 26-11c6 8 13 14 20 20l-11 26 18 11 17-23c9 4 18 6 28 7l4 28h21l4-28c10-1 19-4 28-7l17 23 18-11 -11-26c8-6 14-13 20-20l26 11 11-18 -23-17c4-9 6-18 7-28L392 390zM255 453c-41 0-74-33-74-74 0-41 33-74 74-74 41 0 74 33 74 74C328 420 295 453 255 453z"/>
										</g>
									</svg>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</LayoutOutline>
	)
}

