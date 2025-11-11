"use client";

import Link from "next/link";
import Image from "next/image";

type StatCardProps = {
	title: string;
	value: string | number;
	description: string;
	href: string;
};

export default function StatCard({title, value, description, href}: StatCardProps) {
	const cardBg = "https://cdn.doxaplc.com/doxa-public/cardgradient.svg";
	return (
		<div
			className="
				group w-full max-w-[340px]
				rounded-[28px]
				overflow-hidden
				shadow-[0_10px_30px_rgba(0,0,0,0.35)]
				transition-transform duration-300 will-change-transform
				hover:-translate-y-1
			  "
		>
			{/* --- Background image (your SVG/PNG gradient card) --- */}
			<Image
				src={cardBg}
				alt="Card background"
				fill
				priority
				className="object-cover opacity-30"
				sizes="(max-width: 768px) 320px, 340px"
			/>
			
			{/* --- Content --- */}
			<div className="relative z-10 p-5 sm:p-6 flex flex-col justify-between h-full">
				{/* Top: Title and Value */}
				<div className="flex items-baseline justify-between">
					<p className="text-white/85 text-[15px] sm:text-[16px] font-medium">{title}</p>
					<span className="text-white text-[52px] sm:text-[60px] leading-none font-semibold tracking-tight">
						{value}
					  </span>
				</div>
				
				{/* Middle: Description */}
				<p className="mt-3 text-white/90 text-[14px] sm:text-[15px] leading-relaxed">
					{description}
				</p>
				
				{/* Bottom: View Button */}
				<div className="mt-4">
					<Link
						href={href}
						className="
						  inline-flex items-center gap-2 text-white text-sm
						  px-3.5 py-2 rounded-full
						  bg-white/10 hover:bg-white/20
						  backdrop-blur-sm
						  shadow-[0_4px_12px_rgba(0,0,0,0.25)]
						  transition active:translate-y-[1px]
						"
					>
						<span className="grid place-items-center w-6 h-6 rounded-full bg-white/30">
						  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"
							   className="text-[#3a2a6a]">
							<path d="M8 5v14l11-7z"/>
						  </svg>
						</span>
						View
					</Link>
				</div>
			</div>
		</div>
	);
}
