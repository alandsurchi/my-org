import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				// Vazirmatn covers Kurdish/Arabic script and Latin with matching weights.
				sans: ['Vazirmatn', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
				// Sora for Latin display headings; Arabic-script glyphs fall back to Vazirmatn per glyph.
				display: ['Sora', 'Vazirmatn', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Brand ramp (hue taken from the logo); see src/index.css for the values.
				brand: {
					50: 'hsl(var(--brand-50))',
					100: 'hsl(var(--brand-100))',
					200: 'hsl(var(--brand-200))',
					300: 'hsl(var(--brand-300))',
					400: 'hsl(var(--brand-400))',
					500: 'hsl(var(--brand-500))',
					600: 'hsl(var(--brand-600))',
					700: 'hsl(var(--brand-700))',
					800: 'hsl(var(--brand-800))',
					900: 'hsl(var(--brand-900))',
					950: 'hsl(var(--brand-950))',
					DEFAULT: 'hsl(var(--brand))',
					foreground: 'hsl(var(--brand-foreground))'
				},
				// Warm accent, reserved for primary calls to action.
				'accent-warm': {
					DEFAULT: 'hsl(var(--accent-warm))',
					foreground: 'hsl(var(--accent-warm-foreground))',
					hover: 'hsl(var(--accent-warm-hover))'
				},
				surface: {
					1: 'hsl(var(--surface-1))',
					2: 'hsl(var(--surface-2))',
					3: 'hsl(var(--surface-3))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				card: 'var(--radius-card)',
				pill: '9999px'
			},
			boxShadow: {
				card: 'var(--shadow-card)',
				'card-hover': 'var(--shadow-card-hover)',
				band: 'var(--shadow-band)'
			},
			fontSize: {
				display: ['clamp(2.75rem, 7vw, 5.75rem)', { lineHeight: '1.02', fontWeight: '700' }],
				h1: ['clamp(2.25rem, 4.5vw, 3.5rem)', { lineHeight: '1.1', fontWeight: '700' }],
				h2: ['clamp(1.875rem, 3.2vw, 2.75rem)', { lineHeight: '1.15', fontWeight: '700' }],
				h3: ['1.375rem', { lineHeight: '1.3', fontWeight: '600' }],
				lead: ['1.25rem', { lineHeight: '1.65' }],
				eyebrow: ['0.8125rem', { lineHeight: '1.2', letterSpacing: '0.12em', fontWeight: '600' }]
			},
			maxWidth: {
				content: '80rem'
			},
			transitionDuration: {
				fast: '150ms',
				base: '250ms',
				slow: '400ms'
			},
			transitionTimingFunction: {
				out: 'cubic-bezier(.22, 1, .36, 1)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [tailwindcssAnimate, typography],
} satisfies Config;
