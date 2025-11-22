![514879040-9a0d628e-dfc1-49a8-8956-39eac3232a9b](https://github.com/user-attachments/assets/e4638431-6bc2-41b1-9d38-fc84f24a0a11)


# 🌌 Cosmic Flies

![Static Badge](https://img.shields.io/badge/Project-Cosmic_Flies-purple?style=for-the-badge)
![Static Badge](https://img.shields.io/badge/Language-JavaScript-yellow?style=for-the-badge)
![Static Badge](https://img.shields.io/badge/Frontend-HTML-orange?style=for-the-badge)
![Static Badge](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Cosmic Flies** is a lightweight generative-art project that simulates cosmic particle wings in motion.  
It uses pure **JavaScript + HTML Canvas**, requiring **no backend** and **no dependencies**.  
Simple, aesthetic, and fully customizable.

---

## ✨ Features
- Dynamic, smooth particle motion  
- Customizable colors, speed, glow, and density  
- Pure JavaScript — no frameworks  
- Runs instantly in any browser  
- Clean and minimal architecture  
- MIT Licensed  

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/shloook/Cosmic_Flies.git
cd Cosmic_Flies
```

### 2. Run the project  
Simply open:
```
cosmic.html
```
That’s it — no installation needed.

---

## 📂 Project Structure
```
Cosmic_Flies/
├── cosmic.html      # Main page running the canvas animation
├── cosmic.js        # Particle + rendering logic
├── dd.webp          # Asset (optional)
├── LICENSE          # MIT License
└── README.md        # Documentation
```

---

## 🧠 Core Animation Logic (cosmic.js)
```javascript
const canvas = document.getElementById("cosmicCanvas");
const ctx = canvas.getContext("2d");

let particles = [];

function initParticles(count = 200) {
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 1.5 + 0.5,
            size: Math.random() * 2 + 1
        });
    }
}

function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.angle += (Math.random() - 0.5) * 0.2;

        ctx.fillStyle = "rgba(255, 200, 255, 0.8)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(animate);
}

window.onload = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
    animate();
};
```

---

## 🧪 Customization

You can modify **cosmic.js** to change:

### Particle Count
```javascript
initParticles(400);
```

### Particle Color
```javascript
ctx.fillStyle = "rgba(120, 180, 255, 0.8)";
```

### Motion Behavior
```javascript
p.angle += (Math.random() - 0.5) * 0.4;
```

Adjust values to create:
- Neon waves  
- Glowing butterfly wings  
- Cosmic dust fields  
- Galaxy swirl patterns  

---

## 🤝 Contributing

We welcome contributions!  
Check out `CONTRIBUTING.md` for full guidelines.

### Quick steps:
1. Fork the repo  
2. Create a feature branch  
3. Commit changes  
4. Push & open a pull request  

---

## 📄 License
This project is licensed under the **MIT License**.

---

## ⭐ Acknowledgements
Inspired by generative art, particle motion, and cosmic visual effects.  
Crafted to be simple, elegant, and infinitely customizable.
