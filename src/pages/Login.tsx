import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../contexts/UserContext.ts"
import { apiUrl } from "../constants/global.ts"
import {
    Container,
    Card,
    Heading,
    Text,
    VStack,
    HStack,
    Button,
    Separator,
    Box,
    Input,
    Alert
} from "@chakra-ui/react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub, FaFacebook, FaApple } from "react-icons/fa"

interface OAuthProvider {
    name: string
    icon: React.ReactNode
    colorPalette: string
    variant?: string
    onClick: () => void
    enabled: boolean
}

function Login() {
    const { user, setUser } = useContext(UserContext)
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    // Email/Password form state (for future implementation)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleGoogleLogin = () => {
        setLoading(true)
        setError(null)
        window.location.href = `${apiUrl}/api/oauth2/authorization/google`
    }

    const handleGithubLogin = () => {
        setLoading(true)
        setError(null)
        // Placeholder for GitHub OAuth
        window.location.href = `${apiUrl}/api/oauth2/authorization/github`
    }

    const handleFacebookLogin = () => {
        setLoading(true)
        setError(null)
        // Placeholder for Facebook OAuth
        window.location.href = `${apiUrl}/api/oauth2/authorization/facebook`
    }

    const handleAppleLogin = () => {
        setLoading(true)
        setError(null)
        // Placeholder for Apple OAuth
        window.location.href = `${apiUrl}/api/oauth2/authorization/apple`
    }

    const handleEmailLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        
        // Placeholder for email/password login
        console.log("Email login:", email, password)
        
        // TODO: Implement email/password authentication
        setError("Email login not yet implemented")
        setLoading(false)
    }

    // Define OAuth providers - set enabled to true when ready to use
    const oauthProviders: OAuthProvider[] = [
        {
            name: "Google",
            icon: <FcGoogle size={20} />,
            colorPalette: "gray",
            variant: "outline",
            onClick: handleGoogleLogin,
            enabled: true
        },
        {
            name: "GitHub",
            icon: <FaGithub size={20} />,
            colorPalette: "gray",
            variant: "solid",
            onClick: handleGithubLogin,
            enabled: false // Set to true when configured
        },
        {
            name: "Facebook",
            icon: <FaFacebook size={20} color="#1877F2" />,
            colorPalette: "blue",
            variant: "outline",
            onClick: handleFacebookLogin,
            enabled: false // Set to true when configured
        },
        {
            name: "Apple",
            icon: <FaApple size={20} />,
            colorPalette: "gray",
            variant: "solid",
            onClick: handleAppleLogin,
            enabled: false // Set to true when configured
        }
    ]

    // Filter to only show enabled providers
    const enabledProviders = oauthProviders.filter(provider => provider.enabled)

    if (user) {
        return (
            <Container maxW="md" py={8}>
                <Card.Root>
                    <Card.Body>
                        <VStack gap={4} align="center">
                            <Heading size="lg" color="green.600">
                                ✓ Already Logged In
                            </Heading>
                            <Text color="fg.muted" textAlign="center">
                                You're currently signed in as <strong>{user.name}</strong>
                            </Text>
                            <Button
                                colorPalette="brand"
                                onClick={() => navigate("/")}
                                width="full"
                            >
                                Go to Dashboard
                            </Button>
                        </VStack>
                    </Card.Body>
                </Card.Root>
            </Container>
        )
    }

    return (
        <Container maxW="md" py={8}>
            <Card.Root>
                <Card.Header textAlign="center">
                    <Heading size="xl" mb={2}>
                        Welcome Back
                    </Heading>
                    <Text color="fg.muted">
                        Sign in to continue to Klatre
                    </Text>
                </Card.Header>

                <Card.Body>
                    <VStack gap={6} width="full">
                        {/* Error Message */}
                        {error && (
                            <Alert.Root status="error" width="full">
                                <Alert.Indicator />
                                <Alert.Title>{error}</Alert.Title>
                            </Alert.Root>
                        )}

                        {/* OAuth Providers */}
                        <VStack gap={3} width="full">
                            {enabledProviders.map((provider) => (
                                <Button
                                    key={provider.name}
                                    width="full"
                                    size="lg"
                                    variant={provider.variant || "outline"}
                                    colorPalette={provider.colorPalette}
                                    onClick={provider.onClick}
                                    disabled={loading}
                                    _hover={{
                                        transform: "translateY(-2px)",
                                        boxShadow: "md"
                                    }}
                                    transition="all 0.2s"
                                >
                                    {provider.icon}
                                    Continue with {provider.name}
                                </Button>
                            ))}
                        </VStack>

                        {/* Divider */}
                        <HStack width="full">
                            <Separator flex={1} />
                            <Text color="fg.muted" fontSize="sm" px={2}>
                                OR
                            </Text>
                            <Separator flex={1} />
                        </HStack>

                        {/* Email/Password Form */}
                        <Box width="full">
                            <form onSubmit={handleEmailLogin}>
                                <VStack gap={4}>
                                    <Box width="full">
                                        <Text fontSize="sm" mb={2} fontWeight="medium">
                                            Email
                                        </Text>
                                        <Input
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            size="lg"
                                            disabled
                                        />
                                    </Box>

                                    <Box width="full">
                                        <Text fontSize="sm" mb={2} fontWeight="medium">
                                            Password
                                        </Text>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            size="lg"
                                            disabled
                                        />
                                    </Box>

                                    <Button
                                        type="submit"
                                        width="full"
                                        size="lg"
                                        colorPalette="brand"
                                        disabled
                                    >
                                        Sign In (Coming Soon)
                                    </Button>
                                </VStack>
                            </form>
                        </Box>

                        {/* Additional Links */}
                        <HStack gap={4} fontSize="sm" color="fg.muted">
                            <Text
                                cursor="pointer"
                                _hover={{ color: "brand.600", textDecoration: "underline" }}
                            >
                                Forgot password?
                            </Text>
                            <Text>•</Text>
                            <Text
                                cursor="pointer"
                                _hover={{ color: "brand.600", textDecoration: "underline" }}
                            >
                                Create account
                            </Text>
                        </HStack>
                    </VStack>
                </Card.Body>

                <Card.Footer justifyContent="center">
                    <Text fontSize="xs" color="fg.muted" textAlign="center">
                        By continuing, you agree to Klatre's Terms of Service and Privacy Policy
                    </Text>
                </Card.Footer>
            </Card.Root>
        </Container>
    )
}

export default Login