import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Test from './components/test.jsx'
import HomePage from './pages/homePage.jsx'
import LoginPage from './pages/loginPage.jsx'
import RegisterPage from './pages/registerPage.jsx'
import AdminPage from './pages/adminPage.jsx'
import TestPage from './pages/test.jsx'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google';
import ForgetPasswordPage from './pages/forgetPasswordPage.jsx'

//682082939892-oca7fl6qdue5b44v90a5slehemuacm3h.apps.googleusercontent.com(client ID)
function App() {
  

  return (
    <GoogleOAuthProvider clientId="682082939892-oca7fl6qdue5b44v90a5slehemuacm3h.apps.googleusercontent.com">
    <BrowserRouter>

    <Toaster position='top-right' />
    <div className="w-full h-screen bg-primary text-secondary">
        <Routes path="/">
            <Route path='/*' element={<HomePage />}/>
            <Route path='/login' element={<LoginPage />}/>
            <Route path='/register' element={<RegisterPage />}/>
            <Route path='/admin/*' element={<AdminPage />}/>
            <Route path='/test' element={<TestPage />}/>
            <Route path='forgot-password' element={<ForgetPasswordPage />}/>
        </Routes>
    </div>
    </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App
