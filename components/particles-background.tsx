"use client"

import type React from "react"
import { useCallback } from "react"
import Particles from "@tsparticles/react"
import type { Engine } from "tsparticles-engine"
import { loadSlim } from "@tsparticles/slim"

const ParticlesBackground: React.FC = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  const options = {
    fullScreen: {
      enable: true,
      zIndex: -1,
    },
    background: {
      color: {
        value: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)",
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
        },
        onClick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        repulse: {
          distance: 120,
          duration: 0.4,
        },
        push: {
          quantity: 4,
        },
      },
    },
    particles: {
      color: {
        value: ["#ff4500", "#ff6b35", "#f7931e", "#dc2626"],
      },
      links: {
        color: "#ff4500",
        distance: 150,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      collisions: {
        enable: true,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: true,
        speed: 1.5,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 60,
      },
      opacity: {
        value: { min: 0.1, max: 0.4 },
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.1,
        },
      },
      shape: {
        type: ["circle", "triangle"],
      },
      size: {
        value: { min: 1, max: 4 },
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 1,
        },
      },
    },
    detectRetina: true,
  }

  return <Particles id="tsparticles" init={particlesInit} options={options as any} />
}

export default ParticlesBackground
