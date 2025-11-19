import React from 'react';
import { useContext } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { UserContext } from "../contexts/UserContext.ts"
import { InviteContext } from "../contexts/InviteContext.tsx"
import {
    Box,
    Container,
    Flex,
    Heading,
    Button,
    HStack,
    Badge,
    Float,
    Circle
} from "@chakra-ui/react"
import { FiHome, FiUsers, FiSettings, FiLogOut, FiLogIn } from "react-icons/fi"
import {BiEnvelope} from "react-icons/bi";

function NavBar() {
    const { user, logout } = useContext(UserContext)
    const { invites } = useContext(InviteContext)
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = async () => {
        logout()
        navigate("/")
    }

    const isActive = (path: string) => location.pathname === path

    const navItems = [
        {
            label: "Home",
            path: "/",
            icon: <FiHome />
        },
        {
            label: "Groups",
            path: "/groups",
            icon: <FiUsers />
        },
        {
            label: "Invites",
            path: "/invites",
            icon: <BiEnvelope/>,
            float: invites.length ? invites.length : null
        },
        {
            label: "Settings",
            path: "/settings",
            icon: <FiSettings />
        }
    ]

    return (
        <Box
            as="nav"
            position="sticky"
            top={0}
            zIndex={1000}
            bg="bg.panel"
            borderBottom="1px solid"
            borderColor="border.subtle"
            boxShadow="sm"
        >
            <Container maxW="7xl" py={4}>
                <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                    {/* Logo/Brand */}
                    <Heading
                        size="xl"
                        color="brand.600"
                        cursor="pointer"
                        onClick={() => navigate("/")}
                        _hover={{ color: "brand.700" }}
                        transition="color 0.2s"
                    >
                        🧗 Klatre
                    </Heading>

                    {/* Navigation Links */}
                    {user && (
                        <HStack gap={2} display={{ base: "none", md: "flex" }}>
                            {navItems.map((item, index) => (
                                <Button
                                    key={index}
                                    variant={isActive(item.path) ? "solid" : "ghost"}
                                    colorPalette={isActive(item.path) ? "brand" : "gray"}
                                    onClick={() => navigate(item.path)}
                                >
                                    {item.icon}
                                    {item.label}
                                    {item.float && (
                                        <Float offsetX={1}>
                                            <Circle size="5" bg="red" color="white">
                                                {item.float}
                                            </Circle>
                                        </Float>
                                    )}
                                </Button>
                            ))}
                        </HStack>
                    )}

                    {/* User Actions */}
                    <HStack gap={3}>
                        {user ? (
                            <>
                                <Badge
                                    colorPalette="green"
                                    size="lg"
                                    px={3}
                                    py={1}
                                    display={{ base: "none", sm: "flex" }}
                                >
                                    {user.name || "User"}
                                </Badge>
                                <Button
                                    colorPalette="red"
                                    variant="outline"
                                    onClick={handleLogout}
                                    size={{ base: "sm", md: "md" }}
                                >
                                    <FiLogOut />
                                    Log Out
                                </Button>
                            </>
                        ) : (
                            <Button
                                colorPalette="brand"
                                onClick={() => navigate("/login")}
                            >
                                <FiLogIn />
                                Log In
                            </Button>
                        )}
                    </HStack>
                </Flex>
            </Container>
        </Box>
    )
}

export default NavBar
