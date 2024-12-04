declare type WorkData = {
		title: string,
		image: string,
		tag: string,
		link: string,
		clamp: boolean,
		details: {
				subTitle: string,
				description: string,
				techStack: string[],
				image: string,
		}
}