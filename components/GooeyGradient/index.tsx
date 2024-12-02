"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Slider } from '../../components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Blob } from './Blob';
import { Particle } from './Particle';
import { AudioService } from '../../lib/audio';

// Global simulation parameters that don't need to be in state
let blobs = [];
let particles = [];
let isInitialized = false;

const GooeyGradient = () => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const audioServiceRef = useRef<AudioService | null>(null);
  const ctxRef = useRef(null);

  // Control states
  const [baseFrequency, setBaseFrequency] = useState(200);
  const [soundVolume, setSoundVolume] = useState(0.15);
  const [gravitationalForce, setGravitationalForce] = useState(20);
  const [particleEnergy, setParticleEnergy] = useState(0.5);
  const [particleSpeed, setParticleSpeed] = useState(5);

  // Initialize simulation only once
  useEffect(() => {
    if (isInitialized) return;
    
    audioServiceRef.current = new AudioService();
    const canvas = containerRef.current;
    ctxRef.current = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize blobs and particles
    const numBlobs = 12;
    const numParticles = 100;
    
    for (let i = 0; i < numBlobs; i++) {
      blobs.push(new Blob(canvas));
    }

    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle(canvas));
    }

    isInitialized = true;

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (audioServiceRef.current) {
        audioServiceRef.current.cleanup();
      }
      isInitialized = false;
      blobs = [];
      particles = [];
    };
  }, []);

  // Update audio parameters when they change
  useEffect(() => {
    if (audioServiceRef.current) {
      audioServiceRef.current.setBaseFrequency(baseFrequency);
      audioServiceRef.current.setSoundVolume(soundVolume);
    }
  }, [baseFrequency, soundVolume]);

  // Animation loop separate from initialization
  useEffect(() => {
    if (!ctxRef.current) return;

    const playCollisionSound = (velocity: number, blobSize: number) => {
      audioServiceRef.current?.playCollisionSound(velocity, blobSize);
    };

    const animate = () => {
      const ctx = ctxRef.current;
      const canvas = containerRef.current;

      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update simulation parameters
      particles.forEach(particle => {
        particle.energy = particleEnergy;
        particle.maxSpeed = particleSpeed;
        particle.gravitationalForce = gravitationalForce;
      });

      blobs.forEach(blob => {
        blob.update();
        blob.draw(ctx);
      });

      particles.forEach(particle => {
        particle.update(blobs, playCollisionSound);
        particle.draw(ctx);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [baseFrequency, soundVolume, gravitationalForce, particleEnergy, particleSpeed]);

  return (
    <div className="relative">
      <div className="fixed inset-0 overflow-hidden bg-black">
        <canvas
          ref={containerRef}
          className="w-full h-full touch-none"
          style={{
            filter: 'url(#goo)',
            mixBlendMode: 'screen',
          }}
        />
      </div>

      <Card className="fixed bottom-4 left-4 w-96 bg-black/50 backdrop-blur-sm border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm">Simulation Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs text-white">Sound Frequency</label>
              <span className="text-xs text-white">{baseFrequency}Hz</span>
            </div>
            <Slider 
              value={[baseFrequency]} 
              onValueChange={([value]) => setBaseFrequency(value)}
              min={100}
              max={500}
              step={10}
              className="my-2"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs text-white">Sound Volume</label>
              <span className="text-xs text-white">{(soundVolume * 100).toFixed(0)}%</span>
            </div>
            <Slider 
              value={[soundVolume]} 
              onValueChange={([value]) => setSoundVolume(value)}
              min={0}
              max={0.3}
              step={0.01}
              className="my-2"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs text-white">Gravitational Force</label>
              <span className="text-xs text-white">{gravitationalForce}</span>
            </div>
            <Slider 
              value={[gravitationalForce]} 
              onValueChange={([value]) => setGravitationalForce(value)}
              min={5}
              max={50}
              step={1}
              className="my-2"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs text-white">Particle Energy</label>
              <span className="text-xs text-white">{particleEnergy.toFixed(1)}</span>
            </div>
            <Slider 
              value={[particleEnergy]} 
              onValueChange={([value]) => setParticleEnergy(value)}
              min={0.1}
              max={1}
              step={0.1}
              className="my-2"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs text-white">Max Particle Speed</label>
              <span className="text-xs text-white">{particleSpeed.toFixed(1)}</span>
            </div>
            <Slider 
              value={[particleSpeed]} 
              onValueChange={([value]) => setParticleSpeed(value)}
              min={2}
              max={10}
              step={0.5}
              className="my-2"
            />
          </div>
        </CardContent>
      </Card>

      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0
                     0 1 0 0 0
                     0 0 1 0 0
                     0 0 0 30 -8"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default GooeyGradient;