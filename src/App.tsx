import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import UserContextProvider from "./contexts/UserContextProvider.tsx"
import SessionContextProvider from "./contexts/SessionContext.tsx"
import NavBar from "./components/NavBar.tsx"
import Home from "./pages/Home.tsx"
import Groups from "./pages/Groups.tsx"
import Login from "./pages/Login.tsx"
import Group from "./pages/Group.tsx"

function App() {
    return (
        <UserContextProvider>
            <SessionContextProvider>
                <Router>
                    <NavBar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/groups" element={<Groups />} />
                        <Route path="/groups/:uuid" element={<Group />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </Router>
            </SessionContextProvider>
        </UserContextProvider>
    )
}

export default App