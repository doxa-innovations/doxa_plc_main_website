import {Route, Routes} from "react-router";
import {Home} from "./Pages/Home.tsx";
import honeyCone from './images/SVGs/honeycone.svg'
import honeyCone2 from './images/SVGs/honeycone2.svg'
import bee1 from './images/SVGs/bee1.svg'
import bee2 from './images/SVGs/bee2.svg'
import bee3 from './images/SVGs/bee3.svg'
import logo from './images/logo.png'
import {ReactElement} from "react";

function App(): ReactElement {
    
    return (
        <main className="h-dvh w-full overflow-hidden">
            <div className="w-full h-full bg-pj-light-Dark grid grid-rows-12">
                <div className={`h-full row-span-2 md:row-span-3 lg:row-span-4 grid grid-flow-col grid-cols-3`}>
                    <div className={`flex md:justify-end items-start`}>
                        <img className='w-8/12' src={bee2} alt=""/>
                    </div>
                    <div className={`grid place-items-center`}>
                        <img className='w-10/12' src={logo} alt=""/>
                    </div>
                    <div className={`h-full grid justify-end relative`}>
                        <img className='h-3/6 md:h-5/6 absolute top-12 right-14 md:right-24 lg:right-28' src={bee1} alt=""/>
                        <img className={'h-4/6 md:h-3/4 '} src={honeyCone} alt=""/>
                    </div>
                
                </div>
                
                
                <Routes>
                <Route index element={<Home/>}/>
                    {/*<Route path='/services' element={<Services />} />*/}
                    {/*<Route path='/prices' element={<Prices />} />*/}
                    {/*<Route path='/team' element={<Team />} />*/}
                    {/*<Route path='/works' element={<Works />} />*/}
                    {/*<Route path='/contact' element={<Contact />} />*/}
                    {/*<Route path='/about' element={<About />} />*/}
                    {/*<Route path='*' element={<Home />} />*/}
                </Routes>
                
                <img className='w-2/12' src={honeyCone2} alt=""/>
                <img className='w-2/12' src={bee3} alt=""/>
            </div>
        </main>
    )
}

export default App
