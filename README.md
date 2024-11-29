# Interactive Gooey Gradient

An immersive, interactive visualization that combines particle systems, blob physics, and audio feedback to create a unique gooey gradient effect. Built with React, Canvas API, and Web Audio API.

## Features

- Real-time particle simulation with gooey effect
- Interactive audio feedback based on particle collisions
- Adjustable parameters through an intuitive UI:
  - Sound frequency and volume
  - Gravitational force
  - Particle energy and speed
- Responsive design that works across different screen sizes
- Smooth animations with canvas-based rendering
- Color-shifting blobs and particles

## Technologies Used

- React 18
- Next.js 14
- TypeScript
- Canvas API
- Web Audio API
- Tailwind CSS
- shadcn/ui components

## Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/profikid/gooey-gradient.git
   cd gooey-gradient
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

The visualization consists of multiple interacting elements:
- Colorful blobs that float around the screen
- Particles that are attracted to the blobs
- Audio feedback when particles interact with blobs

You can adjust various parameters using the control panel:
- **Sound Frequency**: Adjusts the base frequency of collision sounds (100-500Hz)
- **Sound Volume**: Controls the volume of audio feedback (0-30%)
- **Gravitational Force**: Adjusts how strongly blobs attract particles (5-50)
- **Particle Energy**: Controls particle responsiveness to forces (0.1-1.0)
- **Max Particle Speed**: Sets the speed limit for particles (2-10)

## Project Structure

```
gooey-gradient/
├── components/
│   ├── ui/
│   │   ├── card.tsx
│   │   └── slider.tsx
│   └── GooeyGradient/
│       ├── index.tsx
│       ├── Blob.ts
│       └── Particle.ts
├── lib/
│   └── utils.ts
├── app/
│   ├── page.tsx
│   └── layout.tsx
├── styles/
│   └── globals.css
└── public/
```

## Performance Considerations

- The simulation automatically adjusts to the window size
- Uses requestAnimationFrame for smooth animations
- Implements efficient particle-blob interaction calculations
- Audio feedback is optimized to prevent memory leaks

## Browser Support

- Modern browsers with Canvas and Web Audio API support
- Tested on Chrome, Firefox, Safari, and Edge

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built using [shadcn/ui](https://ui.shadcn.com/) components
- Inspired by classic metaball and particle system effects
- Utilizes modern web APIs for smooth performance