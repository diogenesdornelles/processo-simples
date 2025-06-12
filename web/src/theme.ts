import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

// Padrão tag.attr.estado (sem, caso não tenha)

const config = defineConfig({
  globalCss: {
    'html, body': {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
    },
  },
  theme: {
    tokens: {
      colors: {
        purple: {
          50: { value: '#faf5ff' },
          100: { value: '#f3e8ff' },
          200: { value: '#e9d5ff' },
          300: { value: '#d8b4fe' },
          400: { value: '#c084fc' },
          500: { value: '#a855f7' },
          600: { value: '#9333ea' },
          700: { value: '#7c3aed' },
          800: { value: '#6b21a8' },
          900: { value: '#581c87' },
        },
        gray: {
          50: { value: '#f9fafb' },
          100: { value: '#f7fafc' },
          200: { value: '#edf2f7' },
          300: { value: '#e2e8f0' },
          400: { value: '#a0aec0' },
          500: { value: '#718096' },
          600: { value: '#4a5568' },
          700: { value: '#2d3748' },
          800: { value: '#1a202c' },
          900: { value: '#171923' },
        },

        red: {
          50: { value: '#fef2f2' },
          100: { value: '#fee2e2' },
          200: { value: '#fecaca' },
          300: { value: '#fca5a5' },
          400: { value: '#f87171' },
          500: { value: '#ef4444' },
          600: { value: '#dc2626' },
          700: { value: '#b91c1c' },
          800: { value: '#991b1b' },
          900: { value: '#7f1d1d' },
        },
        orange: {
          50: { value: '#fff7ed' },
          100: { value: '#ffedd5' },
          200: { value: '#fed7aa' },
          300: { value: '#fdba74' },
          400: { value: '#fb923c' },
          500: { value: '#f97316' },
          600: { value: '#ea580c' },
          700: { value: '#c2410c' },
          800: { value: '#9a3412' },
          900: { value: '#7c2d12' },
        },
        yellow: {
          50: { value: '#fefce8' },
          100: { value: '#fef3c7' },
          200: { value: '#fde68a' },
          300: { value: '#fcd34d' },
          400: { value: '#fbbf24' },
          500: { value: '#f59e0b' },
          600: { value: '#d97706' },
          700: { value: '#b45309' },
          800: { value: '#92400e' },
          900: { value: '#78350f' },
        },
        green: {
          50: { value: '#f0fdf4' },
          100: { value: '#dcfce7' },
          200: { value: '#bbf7d0' },
          300: { value: '#86efac' },
          400: { value: '#4ade80' },
          500: { value: '#22c55e' },
          600: { value: '#16a34a' },
          700: { value: '#15803d' },
          800: { value: '#166534' },
          900: { value: '#14532d' },
        },
        blue: {
          50: { value: '#eff6ff' },
          100: { value: '#dbeafe' },
          200: { value: '#bfdbfe' },
          300: { value: '#93c5fd' },
          400: { value: '#60a5fa' },
          500: { value: '#3b82f6' },
          600: { value: '#2563eb' },
          700: { value: '#1d4ed8' },
          800: { value: '#1e40af' },
          900: { value: '#1e3a8a' },
        },
        white: { value: '#ffffff' },
        black: { value: '#000000' },
      },
    },
    semanticTokens: {
      colors: {
        'primary.purple.bg': {
          value: { base: '{colors.purple.700}', _dark: '{colors.purple.900}' },
        },
        'primary.purple.bg.hover': {
          value: { base: '{colors.purple.600}', _dark: '{colors.purple.800}' },
        },
        'primary.purple.text': {
          value: { base: '{colors.purple.700}', _dark: '{colors.purple.200}' },
        },
        'primary.purple.text.hover': {
          value: { base: '{colors.purple.600}', _dark: '{colors.purple.100}' },
        },

        'secondary.purple.bg': {
          value: { base: '{colors.purple.500}', _dark: '{colors.purple.800}' },
        },
        'secondary.purple.bg.hover': {
          value: { base: '{colors.purple.400}', _dark: '{colors.purple.700}' },
        },
        'secondary.purple.text': {
          value: { base: '{colors.purple.500}', _dark: '{colors.purple.300}' },
        },
        'secondary.purple.text.hover': {
          value: { base: '{colors.purple.400}', _dark: '{colors.purple.200}' },
        },

        'primary.gray.bg': {
          value: { base: '{colors.gray.100}', _dark: '{colors.gray.800}' },
        },
        'primary.gray.bg.hover': {
          value: { base: '{colors.gray.200}', _dark: '{colors.gray.700}' },
        },
        'primary.gray.text': {
          value: { base: '{colors.gray.900}', _dark: '{colors.gray.100}' },
        },
        'primary.gray.text.hover': {
          value: { base: '{colors.gray.800}', _dark: '{colors.gray.200}' },
        },

        'secondary.gray.bg': {
          value: { base: '{colors.gray.200}', _dark: '{colors.gray.900}' },
        },
        'secondary.gray.bg.hover': {
          value: { base: '{colors.gray.300}', _dark: '{colors.gray.800}' },
        },
        'secondary.gray.text': {
          value: { base: '{colors.gray.600}', _dark: '{colors.gray.400}' },
        },
        'secondary.gray.text.hover': {
          value: { base: '{colors.gray.800}', _dark: '{colors.gray.200}' },
        },

        'primary.success.bg': {
          value: { base: '{colors.green.600}', _dark: '{colors.green.800}' },
        },
        'primary.success.bg.hover': {
          value: { base: '{colors.green.500}', _dark: '{colors.green.700}' },
        },
        'primary.success.text': {
          value: { base: '{colors.green.700}', _dark: '{colors.green.200}' },
        },
        'primary.success.text.hover': {
          value: { base: '{colors.green.600}', _dark: '{colors.green.100}' },
        },

        'secondary.success.bg': {
          value: { base: '{colors.green.100}', _dark: '{colors.green.900}' },
        },
        'secondary.success.bg.hover': {
          value: { base: '{colors.green.200}', _dark: '{colors.green.800}' },
        },
        'secondary.success.text': {
          value: { base: '{colors.green.600}', _dark: '{colors.green.300}' },
        },
        'secondary.success.text.hover': {
          value: { base: '{colors.green.500}', _dark: '{colors.green.200}' },
        },

        'primary.error.bg': {
          value: { base: '{colors.red.600}', _dark: '{colors.red.800}' },
        },
        'primary.error.bg.hover': {
          value: { base: '{colors.red.500}', _dark: '{colors.red.700}' },
        },
        'primary.error.text': {
          value: { base: '{colors.red.700}', _dark: '{colors.red.200}' },
        },
        'primary.error.text.hover': {
          value: { base: '{colors.red.600}', _dark: '{colors.red.100}' },
        },

        'secondary.error.bg': {
          value: { base: '{colors.red.100}', _dark: '{colors.red.900}' },
        },
        'secondary.error.bg.hover': {
          value: { base: '{colors.red.200}', _dark: '{colors.red.800}' },
        },
        'secondary.error.text': {
          value: { base: '{colors.red.600}', _dark: '{colors.red.300}' },
        },
        'secondary.error.text.hover': {
          value: { base: '{colors.red.500}', _dark: '{colors.red.200}' },
        },

        'primary.attention.bg': {
          value: { base: '{colors.orange.600}', _dark: '{colors.orange.800}' },
        },
        'primary.attention.bg.hover': {
          value: { base: '{colors.orange.500}', _dark: '{colors.orange.700}' },
        },
        'primary.attention.text': {
          value: { base: '{colors.orange.700}', _dark: '{colors.orange.200}' },
        },
        'primary.attention.text.hover': {
          value: { base: '{colors.orange.600}', _dark: '{colors.orange.100}' },
        },

        'secondary.attention.bg': {
          value: { base: '{colors.orange.100}', _dark: '{colors.orange.900}' },
        },
        'secondary.attention.bg.hover': {
          value: { base: '{colors.orange.200}', _dark: '{colors.orange.800}' },
        },
        'secondary.attention.text': {
          value: { base: '{colors.orange.600}', _dark: '{colors.orange.300}' },
        },
        'secondary.attention.text.hover': {
          value: { base: '{colors.orange.500}', _dark: '{colors.orange.200}' },
        },

        'primary.info.bg': {
          value: { base: '{colors.blue.600}', _dark: '{colors.blue.800}' },
        },
        'primary.info.bg.hover': {
          value: { base: '{colors.blue.500}', _dark: '{colors.blue.700}' },
        },
        'primary.info.text': {
          value: { base: '{colors.blue.700}', _dark: '{colors.blue.200}' },
        },
        'primary.info.text.hover': {
          value: { base: '{colors.blue.600}', _dark: '{colors.blue.100}' },
        },

        'secondary.info.bg': {
          value: { base: '{colors.blue.100}', _dark: '{colors.blue.900}' },
        },
        'secondary.info.bg.hover': {
          value: { base: '{colors.blue.200}', _dark: '{colors.blue.800}' },
        },
        'secondary.info.text': {
          value: { base: '{colors.blue.600}', _dark: '{colors.blue.300}' },
        },
        'secondary.info.text.hover': {
          value: { base: '{colors.blue.500}', _dark: '{colors.blue.200}' },
        },

        'primary.warning.bg': {
          value: { base: '{colors.yellow.500}', _dark: '{colors.yellow.700}' },
        },
        'primary.warning.bg.hover': {
          value: { base: '{colors.yellow.400}', _dark: '{colors.yellow.600}' },
        },
        'primary.warning.text': {
          value: { base: '{colors.yellow.700}', _dark: '{colors.yellow.200}' },
        },
        'primary.warning.text.hover': {
          value: { base: '{colors.yellow.600}', _dark: '{colors.yellow.100}' },
        },

        'secondary.warning.bg': {
          value: { base: '{colors.yellow.100}', _dark: '{colors.yellow.900}' },
        },
        'secondary.warning.bg.hover': {
          value: { base: '{colors.yellow.200}', _dark: '{colors.yellow.800}' },
        },
        'secondary.warning.text': {
          value: { base: '{colors.yellow.600}', _dark: '{colors.yellow.300}' },
        },
        'secondary.warning.text.hover': {
          value: { base: '{colors.yellow.500}', _dark: '{colors.yellow.200}' },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
