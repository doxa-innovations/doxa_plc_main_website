import { useState } from 'react'
import './App.css'
import honeycone from '../src/images/SVGs/honeycone.svg'
import honeycone2 from '../src/images/SVGs/honeycone2.svg'
import bee1 from '../src/images/SVGs/bee1.svg'
import bee2 from '../src/images/SVGs/bee2.svg'
import bee3 from '../src/images/SVGs/bee3.svg'
import { Route, Routes } from 'react-router'
import { Home } from './pages/HomePage'
import { Services } from './pages/Services'
import { Team } from './pages/Team'
import { Works } from './pages/Works'
import { Contact } from './pages/Contact'
import { About } from './pages/About'
import { Prices } from './pages/Prices'

function App() {

  return (
    <div className='min-h-dvh max-h-dvh md:min-h-screen md:max-h-screen overflow-none grid w-screen max-w-screen m-0 p-0 font-pj-font'>
      <div className='bg-pj-light-Dark w-full h-full relative'>
        <img className='absolute top-0 right-0 w-28 md:w-44 z-0' src={honeycone} alt="" />
        <img className='absolute top-16 md:top-28 right-2 w-20 md:w-36 z-0' src={bee1} alt="" />
        <img className="absolute top-0 left-10 md:left-48 w-20 md:w-36 z-0" src={bee2} alt=""/>
        
        <Routes>
            <Route index element={<Home />} />
            <Route path='/services' element={<Services />} />
            <Route path='/prices' element={<Prices />} />
            <Route path='/team' element={<Team />} />
            <Route path='/works' element={<Works />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/about' element={<About />} />
            <Route path='*' element={<Home />} />
        </Routes>
      
        <img className='absolute left-0 top-[40rem] md:top-[20rem] w-24 md:w-44 z-0' src={honeycone2} alt="" />
        <img className='absolute top-[44rem] md:top-[28rem] left-16 md:left-24 w-20 md:w-40 z-0' src={bee3} alt="" />

        <p className='text-sm absolute right-0 left-0 mx-auto bottom-6 text-pj-primary w-max z-50'>©{new Date().getFullYear()} Copyright - Bee Design Studio</p>
      </div>
    </div>
  )
}

export default App
