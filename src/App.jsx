import { useState } from 'react'
import './App.css'

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ChartNav from './pages/nav/ChartNav'
import OpenLayersFullPage from './pages/openlayers/OpenLayersFullPage'
import OpenLayersPartialPage from './pages/openlayers/OpenLayersPartialPage'
import CesiumJSFullPage from './pages/cesium/CesiumJSFullPage'
import CesiumJSMarkerPage from './pages/cesium/CesiumJSMarkerPage'
import CesiumJSRoadPage from './pages/cesium/CesiumJSRoadPage'
import CesiumJSRoadPage2 from './pages/cesium/CesiumJSRoadPage2'

function App() {
  
  return (
    <>
      <BrowserRouter>
        {/* 상단 탭 네비게이션 */}
        <ChartNav/>
        <Routes>
          <Route path="/" element={<OpenLayersFullPage />} />
          <Route path="/open-full" element={<OpenLayersFullPage />} />
          <Route path="/open-partial" element={<OpenLayersPartialPage />} />
          <Route path="/cesium-full" element={<CesiumJSFullPage />} />
          <Route path="/cesium-marker" element={<CesiumJSMarkerPage />} />
          <Route path="/cesium-road" element={<CesiumJSRoadPage />} />
          <Route path="/cesium-road2" element={<CesiumJSRoadPage2 />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
