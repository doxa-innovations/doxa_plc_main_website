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

function App() {

  return (
    <div className='min-h-screen max-h-screen overflow-none grid w-screen max-w-screen m-0 p-0 font-pj-font'>
      <div className='bg-pj-light-Dark w-full h-full relative'>
        <img className='absolute top-0 right-0 w-44 z-0' src={honeycone} alt="" />
        <img className='absolute top-28 right-2 w-36 z-0' src={bee1} alt="" />
        <img className="absolute top-0 left-48 w-36 z-0" src={bee2} alt=""/>
        
        <Routes>
            <Route index element={<Home />} />
            <Route path='/services' element={<Services />} />
            <Route path='/team' element={<Team />} />
            <Route path='/works' element={<Works />} />
            <Route path='/contact' element={<Contact />} />


        </Routes>
      
        <img className='absolute left-0 top-72 w-44 z-0' src={honeycone2} alt="" />
        <img className='absolute top-[460px] left-24 w-40 z-0' src={bee3} alt="" />

        <p className='text-sm absolute right-0 left-0 mx-auto bottom-6 text-pj-primary w-max z-50'>©{new Date().getFullYear()} Copyright - Bee Design Studio</p>
      </div>
    </div>
  )
}

export default App
