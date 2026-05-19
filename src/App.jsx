import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import Editor from './pages/Editor'
import TentangPage from './pages/TentangPage'
import SyaratKetentuan from './pages/SyaratKetentuan'
import './App.css'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kategori/:slug" element={<CategoryPage />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/tentang" element={<TentangPage />} />
          <Route path="/syarat-ketentuan" element={<SyaratKetentuan />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
