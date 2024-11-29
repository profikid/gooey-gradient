"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Blob } from './Blob';
import { Particle } from './Particle';

// Global simulation parameters that don't need to be in state
let blobs = [];
let particles = [];
let isInitialized = false;

const GooeyGradient = () => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
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
    
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
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
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      isInitialized = false;
      blobs = [];
      particles = [];
    };
  }, []);