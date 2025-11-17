import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import UserContextProvider from "./contexts/UserContextProvider.tsx"
import NavBar from "./components/NavBar.tsx"
import Home from "./pages/Home.tsx"
import Groups from "./pages/Groups.tsx"
import Login from "./pages/Login.tsx"
import Group from "./pages/Group.tsx"
import Invites from "./components/Invites.tsx";

function App() {
    return (
        <UserContextProvider>
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/groups/:uuid" element={<Group />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/invites" element={<Invites />} />
                </Routes>
            </Router>
        </UserContextProvider>
    )
}

export default App