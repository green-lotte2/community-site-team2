import React from 'react'
import Header from '../components/main/Header'
import Aside from '../components/main/Aside'
import Footer from '../components/main/Footer'
import Contents from '../components/main/Contents'
import "../styles/style.scss";

const DefaultLayout = ({ children }) => {
  return (
    <div>
        <div className='wrap'>
          <Aside/>
          <div className='cont'>
            <Header/>
            <main>
              <contents>
                  {children}
              </contents>
            </main> 
            <Footer/>
          </div>    
        </div>  
    </div>
  )
}

export default DefaultLayout