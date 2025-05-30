import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"], 
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))', 
        'background-card-container': 'hsl(var(--background-card-container-raw))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card-raw))', 
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))', /* This is now neon-yellow */
  				foreground: 'hsl(var(--accent-foreground))'
  			},
        'neon-yellow': {
          DEFAULT: 'hsl(var(--neon-yellow-raw))',
          foreground: 'hsl(var(--background-dark-end-raw))', /* Dark text on yellow */
        },
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border-raw))', 
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))', /* This is now neon-yellow */
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: { 
  				DEFAULT: 'hsl(var(--background))', 
  				foreground: 'hsl(var(--foreground))',
  				primary: 'hsl(var(--primary))',
  				'primary-foreground': 'hsl(var(--primary-foreground))',
  				accent: 'hsl(var(--accent))',
  				'accent-foreground': 'hsl(var(--accent-foreground))',
  				border: 'hsl(var(--border))',
  				ring: 'hsl(var(--ring))'
  			},
        'prompt-system': 'hsl(var(--prompt-system))',
        'prompt-user': 'hsl(var(--prompt-user))',
        'prompt-rag': 'hsl(var(--prompt-rag))',
        'prompt-constraints': 'hsl(var(--prompt-constraints))',
        'prompt-guardrails': 'hsl(var(--prompt-guardrails))',
        'prompt-tools': 'hsl(var(--prompt-tools))',
        'prompt-examples': 'hsl(var(--prompt-examples))',
        'icon-predictable-pricing': 'var(--icon-predictable-pricing-bg)',
        'icon-fast-turnaround': 'var(--icon-fast-turnaround-bg)',
        'icon-highest-quality': 'var(--icon-highest-quality-bg)',
        'icon-scale-anytime': 'var(--icon-scale-anytime-bg)',
        'icon-unique-yours': 'var(--icon-unique-yours-bg)',
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
        'fadeInGrow': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-yellow-glow': { /* Added from globals.css for reference if needed directly in Tailwind */
          '0%, 100%': {
            boxShadow: '0 0 10px 2px hsl(var(--neon-yellow-raw)/0.3), 0 0 3px 0px hsl(var(--neon-yellow-raw)/0.5) inset',
            borderColor: 'hsl(var(--neon-yellow-raw)/0.6)',
          },
          '50%': {
            boxShadow: '0 0 20px 5px hsl(var(--neon-yellow-raw)/0.5), 0 0 7px 1px hsl(var(--neon-yellow-raw)/0.7) inset',
            borderColor: 'hsl(var(--neon-yellow-raw))',
          },
        }
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
        'fadeInGrow': 'fadeInGrow 0.5s ease-out forwards',
        'pulse-yellow-glow': 'pulse-yellow-glow 2.5s infinite ease-in-out',
  		},
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
