import {ReactElement, useEffect, useState} from "react";

export const LiveBGMain = ({itemNumber}: { itemNumber: number }): ReactElement => {
		const [positions, setPositions] = useState(
				Array.from({length: itemNumber}, () => ({top: "50%", left: "50%"}))
		);
		
		const getSecureRandomPercentage = () => {
				const array = new Uint32Array(1);
				window.crypto.getRandomValues(array);
				return array[0] % 101; // Random number between 0 and 100
		};
		
		const randomizePositions = () => {
				return positions.map(() => ({
						top: `${getSecureRandomPercentage()}%`,
						left: `${getSecureRandomPercentage()}%`,
				}));
		};
		
		useEffect(() => {
				// Randomize positions on component mount
				setPositions(randomizePositions());
		}, []);
		
		return (
				<div
						className={`w-full h-full bottom-0 absolute z-0 grid place-items-center`}
				>
						<div className={`relative w-full h-full filter blur-[8px] md:blur-md p-32`}>
								{
										positions.map((position, index) => (
												<svg key={index} className={`absolute w-28 sm:w-32 md:w-44 lg:w-60 aspect-square rounded flex items-center justify-center
																text-white font-bold animate-blob fill-pj-primary`} viewBox="0 0 177 195"
														 style={{
																 top: position.top,
																 left: position.left,
																 animationDelay: `${index * 1000}ms`
														 }}
														 xmlns="http://www.w3.org/2000/svg"
												>
														<path
																d="M75.5 3.50556C83.5444 -1.1389 93.4556 -1.1389 101.5 3.50555L159.937 37.2444C167.982 41.8889 172.937 50.4722 172.937 59.7611V127.239C172.937 136.528 167.982 145.111 159.937 149.756L101.5 183.494C93.4556 188.139 83.5444 188.139 75.5 183.494L17.0625 149.756C9.0181 145.111 4.06252 136.528 4.06252 127.239V59.7611C4.06252 50.4722 9.01809 41.8889 17.0625 37.2444L75.5 3.50556Z"
														/>
												</svg>
										))
								}
						</div>
				</div>
		)
}


export const LiveBGStatic = ({itemNumber}: { itemNumber: number }): ReactElement => {
		const positions = Array.from({length: itemNumber}, () => ({top: 80, left: 80}))
		
		return (
				<div
						className={`w-full h-full bottom-0 absolute z-0 grid place-items-center`}
				>
						<div className={`relative w-full h-full filter blur-md p-32`}>
								{
										positions.map((position, index) => (
												<svg key={index} className={`absolute w-60 h-60 rounded flex items-center justify-center
																text-white font-bold animate-blob fill-pj-primary`} viewBox="0 0 177 195"
														 style={{
																 top: `${position.top - 5}%`,
																 left: `${position.left - (index * 40)}%`,
																 animationDelay: `${index * 1000}ms`
														 }}
														 xmlns="http://www.w3.org/2000/svg"
												>
														<path
																d="M75.5 3.50556C83.5444 -1.1389 93.4556 -1.1389 101.5 3.50555L159.937 37.2444C167.982 41.8889 172.937 50.4722 172.937 59.7611V127.239C172.937 136.528 167.982 145.111 159.937 149.756L101.5 183.494C93.4556 188.139 83.5444 188.139 75.5 183.494L17.0625 149.756C9.0181 145.111 4.06252 136.528 4.06252 127.239V59.7611C4.06252 50.4722 9.01809 41.8889 17.0625 37.2444L75.5 3.50556Z"
														/>
												</svg>
										))
								}
						</div>
				</div>
		)
}