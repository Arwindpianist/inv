"use client"

import { useEffect, useRef } from "react"

interface NetworkAnimationProps {
  opacity?: number
  variant?: "primary" | "secondary" | "accent" | "mixed"
}

export function NetworkAnimation({ opacity = 0.3, variant = "mixed" }: NetworkAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const updateCanvasSize = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.offsetWidth
        canvas.height = parent.offsetHeight
      }
    }

    updateCanvasSize()

    const nodes: { x: number; y: number; vx: number; vy: number; color: string }[] = []
    const nodeCount = 60

    // Brand colors - gold, teal, blue
    const colors = {
      primary: [177, 162, 53], // #b1a235
      secondary: [35, 108, 113], // #236c71
      accent: [47, 63, 152], // #2f3f98
    }

    const getNodeColor = () => {
      if (variant === "primary") return colors.primary
      if (variant === "secondary") return colors.secondary
      if (variant === "accent") return colors.accent
      // Mixed - randomly choose
      const colorKeys = Object.keys(colors) as Array<keyof typeof colors>
      return colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]]
    }

    for (let i = 0; i < nodeCount; i++) {
      const color = getNodeColor()
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`,
      })
    }

    let animationId: number

    function animate() {
      if (!ctx || !canvas) return

      // Fade effect
      ctx.fillStyle = "rgba(16, 15, 5, 0.08)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      nodes.forEach((node, i) => {
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Draw node
        ctx.beginPath()
        ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()

        // Draw connections
        nodes.forEach((otherNode, j) => {
          if (i >= j) return // Avoid duplicate lines
          const dx = node.x - otherNode.x
          const dy = node.y - otherNode.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 180) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            const alpha = 0.25 * (1 - distance / 180)
            ctx.strokeStyle = node.color.replace(/[\d.]+\)$/, `${alpha})`)
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      updateCanvasSize()
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [variant])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity }} />
}
