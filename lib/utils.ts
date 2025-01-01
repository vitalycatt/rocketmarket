import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const gradientPairs = [
  ['#FF6B6B', '#4ECDC4'], // Red to Teal
  ['#A8E6CF', '#DCEDC1'], // Mint to Light Green
  ['#FFD93D', '#FF6B6B'], // Yellow to Red
  ['#6C5CE7', '#A8E6CF'], // Purple to Mint
  ['#FF8C94', '#FFB6B9'], // Coral to Pink
  ['#98DDCA', '#D5ECC2'], // Turquoise to Sage
  ['#FFA07A', '#FFD700'], // Light Salmon to Gold
  ['#89CFF0', '#B0E0E6'], // Baby Blue to Powder Blue
];

export const getRandomGradient = () => {
  const index = Math.floor(Math.random() * gradientPairs.length);
  return gradientPairs[index];
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
