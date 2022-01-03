import {lazy, Suspense} from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import AppHeader from "../appHeader/appHeader";
import Spinner from "../spinner/spinner";
import {SinglePage, SingleComicLayout, SingleCharacterLayout} from '../pages'

const Page404 = lazy(() => import('../pages/404'))
const MainPage = lazy(() => import('../pages/mainPage'))
const ComicsPage = lazy(() => import('../pages/comicsPage'))

const App = () => {
  return (
    <Router>
      <div className="app">
        <AppHeader/>
        <main>
          <Suspense fallback={<Spinner/>}>
            <Routes>
              <Route path="/" element={<MainPage/>} />
              <Route path="/comics" element={<ComicsPage/>} />
              <Route path="/comics/:id" element={<SinglePage Component={SingleComicLayout} dataType='comic'/>} />
              <Route path="/characters/:id" element={<SinglePage Component={SingleCharacterLayout} dataType='character'/>} />
              <Route path="*" element={<Page404/>}/>
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  )
}

export default App