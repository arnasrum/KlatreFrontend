import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import UserContextProvider from "./contexts/UserContextProvider.tsx"
import NavBar from "./components/navigation/NavBar.tsx"
import Home from "./pages/home/Home.tsx"
import Groups from "./pages/groups/Groups.tsx"
import Login from "./pages/login/Login.tsx"
import Group from "./pages/group/Group.tsx"
import Invites from "./components/users/Invites.tsx";
import { InviteProvider } from "./contexts/InviteContext.tsx";

function App() {
    return (
        <UserContextProvider>
            <InviteProvider>
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
            </InviteProvider>
        </UserContextProvider>
    )
}

export default App