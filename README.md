# Pokedex Web App

A modern, fully-featured Pokedex web app built with **React**, **TypeScript**, **Vite**, **TailwindCSS**, and **Radix UI** components. It uses [PokeAPI](https://pokeapi.co/api/v2) to fetch Pokemon data and provides a rich UI with search functionality, toast notifications, text-to-speech, and detailed Pokemon information.

---

## Features

- Search for any Pokemon by name or ID.
- Display detailed Pokemon information:
  - Images (front, back, shiny)
  - Stats (HP, Attack, Defense, etc.)
  - Types
  - Weight & height
  - Description / flavor text
  - Evolution chain
  - Moves
- Toast notifications for feedback (success/error).
- Text-to-speech for Pokemon names.
- Fully responsive layout with TailwindCSS.
- Carousel for multiple images and evolutions.
- Error handling for invalid searches.

---

## Tech Stack

- **Frontend Framework**: React 18, Vite
- **Styling**: TailwindCSS, tailwind-merge, tailwindcss-animate
- **UI Components**: Radix UI (Accordion, Tabs, Toast, Tooltip, etc.)
- **State Management & Data Fetching**: @tanstack/react-query, React Context
- **Forms & Validation**: react-hook-form, zod
- **Routing**: react-router-dom
- **Notifications**: sonner
- **Charts**: recharts
- **Utilities**: clsx, date-fns, lucide-react, input-otp
- **Networking**: axios

---

## Installation

```bash
# Clone repository
git clone https://github.com/yourusername/pokedex-webapp.git
cd pokedex-webapp

# Install dependencies
npm install

# Start development server
npm run dev
