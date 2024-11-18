import {Route, Routes} from "react-router";
import {Home} from "./Pages/Home.tsx";
import honeycone from '../src/images/SVGs/honeycone.svg'
import honeycone2 from '../src/images/SVGs/honeycone2.svg'
import bee1 from '../src/images/SVGs/bee1.svg'
import bee2 from '../src/images/SVGs/bee2.svg'
import bee3 from '../src/images/SVGs/bee3.svg'

function App() {
    
    return (
        <main className="h-dvh w-full overflow-hidden">
            <div className="w-full h-full bg-pj-light-Dark grid ">
                <img className='absolute top-0 right-0 w-28 md:w-44 z-0' src={honeycone} alt=""/>
                <img className='absolute top-16 md:top-28 right-2 w-20 md:w-36 z-0' src={bee1} alt=""/>
                <img className="absolute top-0 left-10 md:left-48 w-20 md:w-36 z-0" src={bee2} alt=""/>
                
                <Routes>
                    <Route index element={<Home />} />
                    {/*<Route path='/services' element={<Services />} />*/}
                    {/*<Route path='/prices' element={<Prices />} />*/}
                    {/*<Route path='/team' element={<Team />} />*/}
                    {/*<Route path='/works' element={<Works />} />*/}
                    {/*<Route path='/contact' element={<Contact />} />*/}
                    {/*<Route path='/about' element={<About />} />*/}
                    {/*<Route path='*' element={<Home />} />*/}
                </Routes>
                
                <img className='absolute left-0 top-[40rem] md:top-[20rem] w-24 md:w-40 z-0' src={honeycone2} alt=""/>
                <img className='absolute top-[44rem] md:top-[28rem] left-20 md:left-24 w-20 md:w-36 z-0' src={bee3} alt=""/>
            </div>
        </main>
    )
}

export default App
