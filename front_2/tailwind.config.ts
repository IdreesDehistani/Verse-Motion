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
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
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
					foreground: 'hsl(var(--accent-foreground))',
					glow: 'hsl(var(--accent-glow))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				success: 'hsl(var(--success))',
				warning: 'hsl(var(--warning))',
				lyric: {
					highlight: 'hsl(var(--lyric-highlight))',
					active: 'hsl(var(--lyric-active))',
					upcoming: 'hsl(var(--lyric-upcoming))',
					past: 'hsl(var(--lyric-past))'
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
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				},
				'lyric-glow': {
					'0%, 100%': { textShadow: '0 0 20px hsl(var(--lyric-highlight))' },
					'50%': { textShadow: '0 0 30px hsl(var(--lyric-highlight)), 0 0 40px hsl(var(--accent))' }
				},
				'wave-flow': {
					'0%': { transform: 'translateX(-100%) rotate(0deg)' },
					'100%': { transform: 'translateX(100vw) rotate(360deg)' }
				},
				'pulse-gentle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'slide-up': {
					from: { transform: 'translateY(20px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'fade-in': {
					from: { opacity: '0', transform: 'scale(0.95)' },
					to: { opacity: '1', transform: 'scale(1)' }
				},
				'bounce-gentle': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' }
				},
				'emphasis-pulse': {
					'0%, 100%': { 
						transform: 'scale(1)', 
						textShadow: '0 0 10px hsl(var(--lyric-highlight))' 
					},
					'50%': { 
						transform: 'scale(1.2)', 
						textShadow: '0 0 20px hsl(var(--lyric-highlight)), 0 0 30px hsl(var(--accent))' 
					}
				},
				'word-highlight': {
					'0%': { transform: 'scale(1) rotate(0deg)' },
					'25%': { transform: 'scale(1.1) rotate(1deg)' },
					'75%': { transform: 'scale(1.1) rotate(-1deg)' },
					'100%': { transform: 'scale(1) rotate(0deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'lyric-glow': 'lyric-glow 2s ease-in-out infinite',
				'pulse-gentle': 'pulse-gentle 3s ease-in-out infinite',
				'slide-up': 'slide-up 0.4s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'bounce-gentle': 'bounce-gentle 0.6s ease-in-out',
				'wave-flow': 'wave-flow 20s linear infinite',
				'emphasis-pulse': 'emphasis-pulse 1s ease-in-out infinite',
				'word-highlight': 'word-highlight 0.6s ease-in-out'
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-background': 'var(--gradient-background)',
				'gradient-player': 'var(--gradient-player)'
			},
			boxShadow: {
				'glow': 'var(--shadow-glow)',
				'player': 'var(--shadow-player)',
				'card': 'var(--shadow-card)'
			},
			fontFamily: {
				'display': ['Inter', 'system-ui', 'sans-serif'],
				'sans': ['Poppins', 'system-ui', 'sans-serif'],
				'body': ['Manrope', 'system-ui', 'sans-serif'],
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
