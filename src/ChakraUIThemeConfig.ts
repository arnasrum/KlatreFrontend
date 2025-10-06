import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e6f2ff" },
          100: { value: "#baddff" },
          200: { value: "#8dc8ff" },
          300: { value: "#5fb3ff" },
          400: { value: "#319eff" },
          500: { value: "#0089ff" },
          600: { value: "#006dd1" },
          700: { value: "#0051a3" },
          800: { value: "#003675" },
          900: { value: "#001a47" },
        },
      },
    },
    semanticTokens: {
      colors: {
        // Force text colors to be black/dark by default
        "fg.default": {
          value: { base: "gray.900", _dark: "gray.100" }
        },
        "fg.muted": {
          value: { base: "gray.600", _dark: "gray.400" }
        },
        "fg.subtle": {
          value: { base: "gray.500", _dark: "gray.500" }
        },
        "fg.emphasized": {
          value: { base: "gray.900", _dark: "gray.50" }
        },
      }
    },

  },
  globalCss: {
    body: {
      bg: "white",
      color: "gray.900",
    },
    "*, *::before, *::after": {
      borderColor: "gray.200",
    }
  }
})

export const system = createSystem(defaultConfig, customConfig)