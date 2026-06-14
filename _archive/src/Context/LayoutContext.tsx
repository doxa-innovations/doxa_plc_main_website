'use client';

import {createContext, ReactElement, useContext} from 'react';

type LayoutContextType = {
		title: string,
		description?: string,
		backLink: string,
		logoShow?: boolean,
		lgLogoShow?: boolean,
}

type LayoutPropsType = {
		children: ReactElement | ReactElement[],
		title: string,
		description?: string,
		backLink: string,
		logoShow?: boolean,
		lgLogoShow?: boolean,
}
const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({
																	 children,
																	 title = 'Home',
																	 description = '',
																	 backLink,
																	 lgLogoShow = true,
																	 logoShow = true
															 }: LayoutPropsType) => {
		return (
				<LayoutContext.Provider
						value={{
								title,
								description,
								backLink,
								lgLogoShow,
								logoShow,
						}}
				>
						{children}
				</LayoutContext.Provider>
		);
};

export const useLayout = () => {
		const context = useContext(LayoutContext);
		if (!context) {
				throw new Error('useLayout must be used within a LayoutProvider');
		}
		return context;
};
