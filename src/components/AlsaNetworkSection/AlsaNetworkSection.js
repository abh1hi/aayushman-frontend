import { ref, onMounted, onUnmounted } from 'vue'

export default {
    setup() {
        const canvasRef = ref(null)
        let animationFrameId
        let width, height

        // City Data (Relative positions 0-1)
        const cities = [
            { name: "Delhi NCR", x: 0.1, y: 0.55 },
            { name: "Lucknow", x: 0.18, y: 0.7 },
            { name: "Ranchi", x: 0.28, y: 0.85 },
            { name: "Himachal", x: 0.35, y: 0.8 },
            { name: "Mumbai", x: 0.45, y: 0.7 },
            { name: "Punjab", x: 0.5, y: 0.6 },
            { name: "Patna", x: 0.58, y: 0.55 },
            { name: "Rajasthan", x: 0.65, y: 0.5 },
            { name: "Bengaluru", x: 0.75, y: 0.45 },
            { name: "Pune", x: 0.82, y: 0.35 },
            { name: "Indore", x: 0.88, y: 0.2 },
            { name: "Guwahati", x: 0.92, y: 0.05 }
        ]

        const signals = []
        const backgroundParticles = []
        const squares = []

        const init = () => {
            const canvas = canvasRef.value
            if (!canvas) return
            width = canvas.width = canvas.offsetWidth
            height = canvas.height = canvas.offsetHeight

            // Init bg particles
            backgroundParticles.length = 0
            for (let i = 0; i < 50; i++) {
                backgroundParticles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 2,
                    speed: Math.random() * 0.5 + 0.1,
                    opacity: Math.random() * 0.5
                })
            }

            // Init Tech Squares
            squares.length = 0
            for (let i = 0; i < 8; i++) {
                squares.push({
                    x: Math.random() * width * 0.8,
                    y: Math.random() * height * 0.8,
                    w: 50 + Math.random() * 150,
                    h: 50 + Math.random() * 150,
                    opacity: 0.1 + Math.random() * 0.2
                })
            }
        }

        const drawTechSquares = (ctx) => {
            squares.forEach(sq => {
                const grd = ctx.createLinearGradient(sq.x, sq.y, sq.x, sq.y + sq.h);
                grd.addColorStop(0, `rgba(20, 80, 40, ${sq.opacity})`);
                grd.addColorStop(1, `rgba(0, 20, 10, 0.05)`);

                ctx.save();
                ctx.fillStyle = grd;
                ctx.strokeStyle = `rgba(50, 150, 80, ${sq.opacity * 0.5})`;
                ctx.lineWidth = 1;
                ctx.fillRect(sq.x, sq.y, sq.w, sq.h);
                ctx.strokeRect(sq.x, sq.y, sq.w, sq.h);
                ctx.restore();
            })
        }

        const drawMap = (ctx) => {
            // 1. Draw Double Line Path
            // Helper to draw the spline
            const drawSpline = (w, color, shadow) => {
                ctx.beginPath()
                ctx.strokeStyle = color
                ctx.lineWidth = w
                ctx.lineCap = 'round'
                ctx.shadowBlur = shadow ? 10 : 0
                ctx.shadowColor = shadow ? color : 'transparent'

                if (cities.length > 0) {
                    ctx.moveTo(cities[0].x * width, cities[0].y * height)
                    for (let i = 1; i < cities.length; i++) {
                        const xc = (cities[i].x * width + cities[i - 1].x * width) / 2
                        const yc = (cities[i].y * height + cities[i - 1].y * height) / 2
                        ctx.quadraticCurveTo(cities[i - 1].x * width, cities[i - 1].y * height, xc, yc)
                    }
                    const last = cities[cities.length - 1]
                    ctx.lineTo(last.x * width, last.y * height)
                }
                ctx.stroke()
                ctx.shadowBlur = 0
            }

            // Outer Red (Thick)
            drawSpline(6, '#ef4444', true)
            // Inner Black (Thin - creates the "Double Line" gap)
            drawSpline(2, '#000000', false)

            // 2. Nodes (Detailed)
            cities.forEach(city => {
                const cx = city.x * width
                const cy = city.y * height
                const time = Date.now() * 0.002

                // Pulse Wave
                ctx.beginPath()
                ctx.arc(cx, cy, 12 + Math.sin(time * 3 + city.x * 10) * 4, 0, Math.PI * 2)
                ctx.strokeStyle = `rgba(239, 68, 68, ${0.1 + Math.sin(time) * 0.1})`
                ctx.lineWidth = 1
                ctx.stroke()

                // Outer Ring
                ctx.beginPath()
                ctx.arc(cx, cy, 8, 0, Math.PI * 2)
                ctx.strokeStyle = '#ef4444' // Red
                ctx.lineWidth = 1.5
                ctx.stroke()

                // Inner Ring
                ctx.beginPath()
                ctx.arc(cx, cy, 5, 0, Math.PI * 2)
                ctx.strokeStyle = '#ef4444'
                ctx.lineWidth = 1
                ctx.stroke()

                // Center Dot
                ctx.beginPath()
                ctx.arc(cx, cy, 2, 0, Math.PI * 2)
                ctx.fillStyle = '#ef4444'
                ctx.fill()

                // Label
                ctx.fillStyle = '#4ade80' // Green
                ctx.font = '500 11px "Inter", monospace'
                ctx.letterSpacing = '1px'
                ctx.fillText(city.name.toUpperCase(), cx + 20, cy + 4)

                // HUD Connector Line
                ctx.beginPath()
                ctx.moveTo(cx + 10, cy)
                ctx.lineTo(cx + 18, cy)
                ctx.strokeStyle = 'rgba(74, 222, 128, 0.5)'
                ctx.lineWidth = 0.5
                ctx.stroke()
            })

            // Signal Generation
            if (Math.random() < 0.03) {
                signals.push({
                    segmentIndex: Math.floor(Math.random() * (cities.length - 1)),
                    progress: 0,
                    speed: 0.005 + Math.random() * 0.01
                })
            }
        }

        const drawSignals = (ctx) => {
            for (let i = signals.length - 1; i >= 0; i--) {
                const s = signals[i]
                s.progress += s.speed
                if (s.progress >= 1) {
                    s.segmentIndex++
                    s.progress = 0
                    if (s.segmentIndex >= cities.length - 1) {
                        signals.splice(i, 1)
                        continue
                    }
                }

                const start = cities[s.segmentIndex]
                const end = cities[s.segmentIndex + 1]
                if (!start || !end) continue

                // Linear interpolation for signals (simplest robust method)
                const lx = start.x * width + (end.x * width - start.x * width) * s.progress
                const ly = start.y * height + (end.y * height - start.y * height) * s.progress

                ctx.beginPath()
                ctx.arc(lx, ly, 2.5, 0, Math.PI * 2)
                ctx.fillStyle = '#ffffff'
                ctx.shadowBlur = 6
                ctx.shadowColor = '#ffffff'
                ctx.fill()
                ctx.shadowBlur = 0
            }
        }

        const drawBackground = (ctx) => {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
            backgroundParticles.forEach(p => {
                p.y -= p.speed
                if (p.y < 0) p.y = height
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fill()
            })

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
            ctx.lineWidth = 1
            const gridSize = 100
            for (let x = (Date.now() * 0.02) % gridSize; x < width; x += gridSize) {
                ctx.beginPath()
                ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke()
            }
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath()
                ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke()
            }
        }

        const animate = () => {
            const canvas = canvasRef.value
            if (!canvas) return
            const ctx = canvas.getContext('2d')

            ctx.clearRect(0, 0, width, height)

            drawBackground(ctx)
            drawTechSquares(ctx)
            drawMap(ctx)
            drawSignals(ctx)

            animationFrameId = requestAnimationFrame(animate)
        }

        onMounted(() => {
            setTimeout(() => {
                init()
                animate()
            }, 50)
            window.addEventListener('resize', init)
        })

        onUnmounted(() => {
            window.removeEventListener('resize', init)
            cancelAnimationFrame(animationFrameId)
        })

        return {
            canvasRef
        }
    }
}
