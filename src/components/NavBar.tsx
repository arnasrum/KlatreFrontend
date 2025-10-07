import React from 'react';
import { NavLink } from 'react-router-dom';
import { useContext } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { UserContext } from "../contexts/UserContext.ts"
import { apiUrl } from "../constants/global.ts"
import {
    Box,
    Container,
    Flex,
    Heading,
    Button,
    HStack,
    Badge,
    Separator
} from "@chakra-ui/react"
import { FiHome, FiUsers, FiSettings, FiLogOut, FiLogIn } from "react-icons/fi"

function NavBar() {
    const { user, setUser, logout } = useContext(UserContext)
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = async () => {
        logout()
        navigate("/")
    }

    const isActive = (path: string) => location.pathname === path

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
                            <Button
                                variant={isActive("/") ? "solid" : "ghost"}
                                colorPalette={isActive("/") ? "brand" : "gray"}
                                onClick={() => navigate("/")}
                            >
                                <FiHome />
                                Home
                            </Button>
                            <Button
                                variant={isActive("/groups") ? "solid" : "ghost"}
                                colorPalette={isActive("/groups") ? "brand" : "gray"}
                                onClick={() => navigate("/groups")}
                            >
                                <FiUsers />
                                Groups
                            </Button>
                            <Button
                                variant={isActive("/settings") ? "solid" : "ghost"}
                                colorPalette={isActive("/settings") ? "brand" : "gray"}
                                onClick={() => navigate("/settings")}
                            >
                                <FiSettings />
                                Settings
                            </Button>
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
