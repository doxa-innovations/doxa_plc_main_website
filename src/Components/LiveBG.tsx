'use client';
import {ReactElement} from "react";

export const LiveBGStatic = (): ReactElement => {
		
		return (
				<div
						className={`w-full h-full bottom-0 absolute z-0 grid place-items-center`}
				>
						<div className={`relative w-full h-full filter blur-2xl p-32`}>
								<svg className={`absolute w-60 aspect-square rounded flex items-center justify-center
																text-white font-bold animate-blob fill-pj-primary`} viewBox="0 0 177 195"
										 style={{
												 top: `5%`,
												 left: `25%`,
												 animationDelay: `300ms`
										 }}
										 xmlns="http://www.w3.org/2000/svg"
								>
										<path
												d="M75.5 3.50556C83.5444 -1.1389 93.4556 -1.1389 101.5 3.50555L159.937 37.2444C167.982 41.8889 172.937 50.4722 172.937 59.7611V127.239C172.937 136.528 167.982 145.111 159.937 149.756L101.5 183.494C93.4556 188.139 83.5444 188.139 75.5 183.494L17.0625 149.756C9.0181 145.111 4.06252 136.528 4.06252 127.239V59.7611C4.06252 50.4722 9.01809 41.8889 17.0625 37.2444L75.5 3.50556Z"
										/>
								</svg>
								<svg className={`absolute w-60 aspect-square rounded flex items-center justify-center
																text-white font-bold animate-blob fill-pj-primary md:fill-pj-accent`}
										 viewBox="0 0 177 195"
										 style={{
												 top: `20%`,
												 left: `3%`,
										 }}
										 xmlns="http://www.w3.org/2000/svg"
								>
										<path
												d="M75.5 3.50556C83.5444 -1.1389 93.4556 -1.1389 101.5 3.50555L159.937 37.2444C167.982 41.8889 172.937 50.4722 172.937 59.7611V127.239C172.937 136.528 167.982 145.111 159.937 149.756L101.5 183.494C93.4556 188.139 83.5444 188.139 75.5 183.494L17.0625 149.756C9.0181 145.111 4.06252 136.528 4.06252 127.239V59.7611C4.06252 50.4722 9.01809 41.8889 17.0625 37.2444L75.5 3.50556Z"
										/>
								</svg>
								
								{/*<svg className={`absolute w-96 aspect-square rounded flex items-center justify-center*/}
								{/*								text-white font-bold animate-blob fill-pj-primary`} viewBox="0 0 177 195"*/}
								{/*		 style={{*/}
								{/*				 top: `60%`,*/}
								{/*				 left: `20%`,*/}
								{/*				 animationDelay: `2000ms`*/}
								{/*		 }}*/}
								{/*		 xmlns="http://www.w3.org/2000/svg"*/}
								{/*>*/}
								{/*		<path*/}
								{/*				d="M75.5 3.50556C83.5444 -1.1389 93.4556 -1.1389 101.5 3.50555L159.937 37.2444C167.982 41.8889 172.937 50.4722 172.937 59.7611V127.239C172.937 136.528 167.982 145.111 159.937 149.756L101.5 183.494C93.4556 188.139 83.5444 188.139 75.5 183.494L17.0625 149.756C9.0181 145.111 4.06252 136.528 4.06252 127.239V59.7611C4.06252 50.4722 9.01809 41.8889 17.0625 37.2444L75.5 3.50556Z"*/}
								{/*		/>*/}
								{/*</svg>*/}
								<svg className={`absolute w-96 md:w-[800px] aspect-square rounded flex items-center justify-center
																text-white font-bold animate-blob fill-pj-accent`} viewBox="0 0 177 195"
										 style={{
												 top: `0%`,
												 right: `3%`,
												 animationDelay: `800ms`
										 }}
										 xmlns="http://www.w3.org/2000/svg"
								>
										<path
												d="M75.5 3.50556C83.5444 -1.1389 93.4556 -1.1389 101.5 3.50555L159.937 37.2444C167.982 41.8889 172.937 50.4722 172.937 59.7611V127.239C172.937 136.528 167.982 145.111 159.937 149.756L101.5 183.494C93.4556 188.139 83.5444 188.139 75.5 183.494L17.0625 149.756C9.0181 145.111 4.06252 136.528 4.06252 127.239V59.7611C4.06252 50.4722 9.01809 41.8889 17.0625 37.2444L75.5 3.50556Z"
										/>
								</svg>
								<svg className={`absolute w-60 aspect-square rounded flex items-center justify-center
																text-white font-bold animate-blob fill-pj-primary`} viewBox="0 0 177 195"
										 style={{
												 top: `40%`,
												 left: `75%`,
												 animationDelay: `2500ms`
										 }}
										 xmlns="http://www.w3.org/2000/svg"
								>
										<path
												d="M75.5 3.50556C83.5444 -1.1389 93.4556 -1.1389 101.5 3.50555L159.937 37.2444C167.982 41.8889 172.937 50.4722 172.937 59.7611V127.239C172.937 136.528 167.982 145.111 159.937 149.756L101.5 183.494C93.4556 188.139 83.5444 188.139 75.5 183.494L17.0625 149.756C9.0181 145.111 4.06252 136.528 4.06252 127.239V59.7611C4.06252 50.4722 9.01809 41.8889 17.0625 37.2444L75.5 3.50556Z"
										/>
								</svg>
						</div>
				</div>
		)
}