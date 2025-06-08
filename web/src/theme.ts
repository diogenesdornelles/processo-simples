import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

// Padrão tag.attr.estado (sem, caso não tenha)

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        purple: {
          200: { value: '#e9d5ff' },
          300: { value: '#d8b4fe' },
          500: { value: '#a855f7' },
          600: { value: '#9333ea' },
          700: { value: '#7c3aed' },
          800: { value: '#6b21a8' },
          900: { value: '#581c87' },
        },
        gray: {
          100: { value: '#f7fafc' },
          200: { value: '#edf2f7' },
          300: { value: '#E2E8F0' },
          400: { value: '#A0AEC0' },
          600: { value: '#718096' },
          700: { value: '#4A5568' },
          800: { value: '#1a202c' },
          900: { value: '#171923' },
        },
        white: { value: '#ffffff' },
      },
    },
    semanticTokens: {
      colors: {
        'nav.bg': {
          value: { base: '{colors.purple.700}', _dark: '{colors.purple.900}' },
        },
        'nav.bg.hover': {
          value: { base: '{colors.purple.600}', _dark: '{colors.purple.800}' },
        },
        'nav.color': {
          value: { base: '{colors.white}', _dark: '{colors.gray.100}' },
        },
        'nav.color.hover': {
          value: { base: '{colors.purple.200}', _dark: '{colors.purple.300}' },
        },
        'footer.bg': {
          value: { base: '{colors.purple.700}', _dark: '{colors.purple.900}' },
        },
        'form.bg': {
          value: { base: '{colors.white}', _dark: '{colors.gray.800}' },
        },
        'form.color': {
          value: { base: '{colors.gray.900}', _dark: '{colors.gray.100}' },
        },
        'form.color.muted': {
          value: { base: '{colors.gray.600}', _dark: '{colors.gray.400}' },
        },
        'input.bg': {
          value: { base: '{colors.gray.100}', _dark: '{colors.gray.700}' },
        },
        'text.color': {
          value: { base: '{colors.white}', _dark: '{colors.white}' },
        },
        'button.bg': {
          value: { base: '{colors.purple.700}', _dark: '{colors.purple.900}' },
        },
        'button.bg.disabled': {
          value: { base: '{colors.purple.500}', _dark: '{colors.purple.800}' },
        },
        'button.bg.hover': {
          value: { base: '{colors.purple.600}', _dark: '{colors.purple.800}' },
        },
        'button.color': {
          value: { base: '{colors.white}', _dark: '{colors.white}' },
        },
        'button.borderColor': {
          value: { base: '{colors.purple.700}', _dark: '{colors.purple.900}' },
        },
        'link.color': {
          value: { base: '{colors.purple.500}', _dark: '{colors.purple.300}' },
        },
        'link.color.hover': {
          value: { base: '{colors.purple.600}', _dark: '{colors.purple.200}' },
        },
        'menuItem.color': {
          value: { base: '{colors.gray.800}', _dark: '{colors.gray.200}' },
        },
        'menuItem.color.hover': {
          value: { base: '{colors.gray.900}', _dark: '{colors.gray.300}' },
        },
        'headingLg.color': {
          value: { base: '{colors.purple.700}', _dark: '{colors.purple.300}' },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
