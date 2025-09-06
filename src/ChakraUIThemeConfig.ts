import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Primary brand colors
        brand: {
          50: { value: "#eff6ff" },
          100: { value: "#dbeafe" },
          200: { value: "#bfdbfe" },
          300: { value: "#93c5fd" },
          400: { value: "#60a5fa" },
          500: { value: "#3b82f6" },
          600: { value: "#2563eb" },
          700: { value: "#1d4ed8" },
          800: { value: "#1e40af" },
          900: { value: "#1e3a8a" },
          950: { value: "#172554" },
        },
        // Accent colors
        accent: {
          50: { value: "#f0fdf4" },
          100: { value: "#dcfce7" },
          200: { value: "#bbf7d0" },
          300: { value: "#86efac" },
          400: { value: "#4ade80" },
          500: { value: "#22c55e" },
          600: { value: "#16a34a" },
          700: { value: "#15803d" },
          800: { value: "#166534" },
          900: { value: "#14532d" },
          950: { value: "#052e16" },
        },
        // Neutral grays
        neutral: {
          50: { value: "#f9fafb" },
          100: { value: "#f3f4f6" },
          200: { value: "#e5e7eb" },
          300: { value: "#d1d5db" },
          400: { value: "#9ca3af" },
          500: { value: "#6b7280" },
          600: { value: "#4b5563" },
          700: { value: "#374151" },
          800: { value: "#1f2937" },
          900: { value: "#111827" },
          950: { value: "#030712" },
        },
        // Success colors
        success: {
          50: { value: "#ecfdf5" },
          100: { value: "#d1fae5" },
          200: { value: "#a7f3d0" },
          300: { value: "#6ee7b7" },
          400: { value: "#34d399" },
          500: { value: "#10b981" },
          600: { value: "#059669" },
          700: { value: "#047857" },
          800: { value: "#065f46" },
          900: { value: "#064e3b" },
        },
        // Error colors
        error: {
          50: { value: "#fef2f2" },
          100: { value: "#fee2e2" },
          200: { value: "#fecaca" },
          300: { value: "#fca5a5" },
          400: { value: "#f87171" },
          500: { value: "#ef4444" },
          600: { value: "#dc2626" },
          700: { value: "#b91c1c" },
          800: { value: "#991b1b" },
          900: { value: "#7f1d1d" },
        },
        // Warning colors
        warning: {
          50: { value: "#fffbeb" },
          100: { value: "#fef3c7" },
          200: { value: "#fde68a" },
          300: { value: "#fcd34d" },
          400: { value: "#fbbf24" },
          500: { value: "#f59e0b" },
          600: { value: "#d97706" },
          700: { value: "#b45309" },
          800: { value: "#92400e" },
          900: { value: "#78350f" },
        },
      },
      fonts: {
        heading: { value: "Inter, system-ui, sans-serif" },
        body: { value: "Inter, system-ui, sans-serif" },
        mono: { value: "JetBrains Mono, Consolas, monospace" },
      },
      fontSizes: {
        xs: { value: "0.75rem" },
        sm: { value: "0.875rem" },
        md: { value: "1rem" },
        lg: { value: "1.125rem" },
        xl: { value: "1.25rem" },
        "2xl": { value: "1.5rem" },
        "3xl": { value: "1.875rem" },
        "4xl": { value: "2.25rem" },
        "5xl": { value: "3rem" },
        "6xl": { value: "3.75rem" },
      },
      spacing: {
        xs: { value: "0.5rem" },
        sm: { value: "0.75rem" },
        md: { value: "1rem" },
        lg: { value: "1.5rem" },
        xl: { value: "2rem" },
        "2xl": { value: "3rem" },
        "3xl": { value: "4rem" },
      },
      radii: {
        sm: { value: "0.375rem" },
        md: { value: "0.5rem" },
        lg: { value: "0.75rem" },
        xl: { value: "1rem" },
        "2xl": { value: "1.5rem" },
      },
      shadows: {
        sm: { value: "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
        md: { value: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" },
        lg: { value: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" },
        xl: { value: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" },
        "2xl": { value: "0 25px 50px -12px rgb(0 0 0 / 0.25)" },
      },
    },
    semanticTokens: {
      colors: {
        // Semantic color mappings
        bg: {
          canvas: { value: "{colors.white}" },
          subtle: { value: "{colors.neutral.50}" },
          muted: { value: "{colors.neutral.100}" },
          emphasized: { value: "{colors.neutral.200}" },
          disabled: { value: "{colors.neutral.100}" },
        },
        fg: {
          default: { value: "{colors.neutral.900}" },
          muted: { value: "{colors.neutral.600}" },
          subtle: { value: "{colors.neutral.500}" },
          disabled: { value: "{colors.neutral.400}" },
          inverted: { value: "{colors.white}" },
        },
        border: {
          default: { value: "{colors.neutral.200}" },
          muted: { value: "{colors.neutral.100}" },
          subtle: { value: "{colors.neutral.50}" },
          emphasized: { value: "{colors.neutral.300}" },
        },
        // Color palette semantic tokens
        colorPalette: {
          50: { value: "{colors.colorPalette.50}" },
          100: { value: "{colors.colorPalette.100}" },
          200: { value: "{colors.colorPalette.200}" },
          300: { value: "{colors.colorPalette.300}" },
          400: { value: "{colors.colorPalette.400}" },
          500: { value: "{colors.colorPalette.500}" },
          600: { value: "{colors.colorPalette.600}" },
          700: { value: "{colors.colorPalette.700}" },
          800: { value: "{colors.colorPalette.800}" },
          900: { value: "{colors.colorPalette.900}" },
          950: { value: "{colors.colorPalette.950}" },
        },
      },
    },
    textStyles: {
      // Heading styles
      "display.2xl": {
        value: {
          fontSize: "6xl",
          fontWeight: "bold",
          lineHeight: "1.2",
          letterSpacing: "-0.02em",
        },
      },
      "display.xl": {
        value: {
          fontSize: "5xl",
          fontWeight: "bold",
          lineHeight: "1.2",
          letterSpacing: "-0.02em",
        },
      },
      "display.lg": {
        value: {
          fontSize: "4xl",
          fontWeight: "bold",
          lineHeight: "1.2",
          letterSpacing: "-0.02em",
        },
      },
      "heading.xl": {
        value: {
          fontSize: "3xl",
          fontWeight: "bold",
          lineHeight: "1.33",
          letterSpacing: "-0.02em",
        },
      },
      "heading.lg": {
        value: {
          fontSize: "2xl",
          fontWeight: "bold",
          lineHeight: "1.33",
          letterSpacing: "-0.01em",
        },
      },
      "heading.md": {
        value: {
          fontSize: "xl",
          fontWeight: "semibold",
          lineHeight: "1.33",
          letterSpacing: "-0.01em",
        },
      },
      "heading.sm": {
        value: {
          fontSize: "lg",
          fontWeight: "semibold",
          lineHeight: "1.33",
        },
      },
      // Body text styles
      "body.lg": {
        value: {
          fontSize: "lg",
          fontWeight: "normal",
          lineHeight: "1.7",
        },
      },
      "body.md": {
        value: {
          fontSize: "md",
          fontWeight: "normal",
          lineHeight: "1.5",
        },
      },
      "body.sm": {
        value: {
          fontSize: "sm",
          fontWeight: "normal",
          lineHeight: "1.43",
        },
      },
      "body.xs": {
        value: {
          fontSize: "xs",
          fontWeight: "normal",
          lineHeight: "1.5",
        },
      },
    },
    recipes: {
      button: {
        base: {
          fontWeight: "semibold",
          borderRadius: "md",
          transition: "all 0.2s",
          cursor: "pointer",
          _disabled: {
            opacity: 0.5,
            cursor: "not-allowed",
            _hover: {
              transform: "none",
              shadow: "none",
            },
          },
        },
        variants: {
          variant: {
            solid: {
              bg: "colorPalette.600",
              color: "white",
              _hover: {
                bg: "colorPalette.700",
                transform: "translateY(-1px)",
                shadow: "lg",
              },
              _active: {
                bg: "colorPalette.800",
                transform: "translateY(0)",
              },
            },
            outline: {
              borderWidth: "2px",
              borderColor: "colorPalette.600",
              color: "colorPalette.600",
              bg: "transparent",
              _hover: {
                bg: "colorPalette.50",
                transform: "translateY(-1px)",
                shadow: "md",
              },
              _active: {
                bg: "colorPalette.100",
                transform: "translateY(0)",
              },
            },
            ghost: {
              color: "colorPalette.600",
              bg: "transparent",
              _hover: {
                bg: "colorPalette.50",
                transform: "translateY(-1px)",
              },
              _active: {
                bg: "colorPalette.100",
                transform: "translateY(0)",
              },
            },
            subtle: {
              bg: "colorPalette.100",
              color: "colorPalette.800",
              _hover: {
                bg: "colorPalette.200",
                transform: "translateY(-1px)",
                shadow: "sm",
              },
              _active: {
                bg: "colorPalette.300",
                transform: "translateY(0)",
              },
            },
          },
          size: {
            xs: {
              fontSize: "xs",
              px: "2",
              py: "1",
              minH: "6",
            },
            sm: {
              fontSize: "sm",
              px: "3",
              py: "1.5",
              minH: "8",
            },
            md: {
              fontSize: "md",
              px: "4",
              py: "2",
              minH: "10",
            },
            lg: {
              fontSize: "lg",
              px: "6",
              py: "3",
              minH: "12",
            },
            xl: {
              fontSize: "xl",
              px: "8",
              py: "4",
              minH: "14",
            },
          },
        },
        defaultVariants: {
          variant: "solid",
          size: "md",
          colorPalette: "brand",
        },
      },
      card: {
        base: {
          bg: "bg.canvas",
          borderRadius: "lg",
          shadow: "md",
          border: "1px solid",
          borderColor: "border.default",
          overflow: "hidden",
        },
        variants: {
          variant: {
            elevated: {
              shadow: "lg",
              border: "none",
            },
            outline: {
              shadow: "sm",
              borderWidth: "1px",
            },
            filled: {
              bg: "bg.muted",
              shadow: "sm",
              border: "none",
            },
          },
          size: {
            sm: {
              p: "3",
            },
            md: {
              p: "4",
            },
            lg: {
              p: "6",
            },
          },
        },
        defaultVariants: {
          variant: "outline",
          size: "md",
        },
      },
      input: {
        base: {
          borderRadius: "md",
          borderWidth: "1px",
          borderColor: "border.default",
          bg: "bg.canvas",
          px: "3",
          py: "2",
          fontSize: "md",
          transition: "all 0.2s",
          _hover: {
            borderColor: "border.emphasized",
          },
          _focus: {
            borderColor: "colorPalette.500",
            boxShadow: "0 0 0 1px var(--chakra-colors-colorPalette-500)",
            outline: "none",
          },
          _invalid: {
            borderColor: "error.500",
            _focus: {
              borderColor: "error.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-error-500)",
            },
          },
          _disabled: {
            opacity: 0.6,
            cursor: "not-allowed",
            bg: "bg.disabled",
          },
        },
        variants: {
          size: {
            sm: {
              px: "2.5",
              py: "1.5",
              fontSize: "sm",
            },
            md: {
              px: "3",
              py: "2",
              fontSize: "md",
            },
            lg: {
              px: "4",
              py: "3",
              fontSize: "lg",
            },
          },
        },
        defaultVariants: {
          size: "md",
          colorPalette: "brand",
        },
      },
    },
  },
  globalCss: {
    "*": {
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
    },
    "html": {
      fontSize: "16px",
      scrollBehavior: "smooth",
    },
    "body": {
      fontFamily: "body",
      bg: "bg.canvas",
      color: "fg.default",
      lineHeight: "1.5",
      "-webkit-font-smoothing": "antialiased",
      "-moz-osx-font-smoothing": "grayscale",
    },
    // Custom scrollbar
    "::-webkit-scrollbar": {
      width: "8px",
      height: "8px",
    },
    "::-webkit-scrollbar-track": {
      bg: "bg.muted",
    },
    "::-webkit-scrollbar-thumb": {
      bg: "neutral.300",
      borderRadius: "full",
      _hover: {
        bg: "neutral.400",
      },
    },
    // Focus styles
    "*:focus-visible": {
      outline: "2px solid",
      outlineColor: "brand.500",
      outlineOffset: "2px",
    },
    // Link styles
    "a": {
      color: "brand.600",
      textDecoration: "none",
      _hover: {
        color: "brand.700",
        textDecoration: "underline",
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)