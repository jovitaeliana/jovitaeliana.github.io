// Create animated background particles with more connections
function setupAnimatedBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Particle class with enhanced visuals
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5; 
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            
            const isDark = document.documentElement.classList.contains('dark');
            this.color = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)';
            
            this.hue = Math.random() * 60 - 30; // Will be added to base color
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Bounce off edges with slight randomization
            if (this.x > canvas.width || this.x < 0) {
                this.speedX = -this.speedX * (0.9 + Math.random() * 0.2);
            }
            if (this.y > canvas.height || this.y < 0) {
                this.speedY = -this.speedY * (0.9 + Math.random() * 0.2);
            }
            
            // Ensure particles stay within canvas
            if (this.x > canvas.width) this.x = canvas.width;
            if (this.x < 0) this.x = 0;
            if (this.y > canvas.height) this.y = canvas.height;
            if (this.y < 0) this.y = 0;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particles
    const particles = [];
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Track mouse position 
    let mouseX = undefined;
    let mouseY = undefined;
    
    window.addEventListener('mousemove', (event) => {
        mouseX = event.x;
        mouseY = event.y;
    });
    
    window.addEventListener('mouseout', () => {
        mouseX = undefined;
        mouseY = undefined;
    });
    
    // Animation loop with mouse interaction
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw all particles
        particles.forEach(particle => {
            // Add subtle mouse attraction
            if (mouseX !== undefined && mouseY !== undefined) {
                const dx = mouseX - particle.x;
                const dy = mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    const forceX = dx / distance * 0.05;
                    const forceY = dy / distance * 0.05;
                    particle.speedX += forceX;
                    particle.speedY += forceY;
                }
                
                // Limit max speed
                const maxSpeed = 2;
                const currentSpeed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
                if (currentSpeed > maxSpeed) {
                    particle.speedX = (particle.speedX / currentSpeed) * maxSpeed;
                    particle.speedY = (particle.speedY / currentSpeed) * maxSpeed;
                }
            }
            
            particle.update();
            particle.draw();
        });
        
        // Connect particles
        connectParticles();
        
        requestAnimationFrame(animate);
    }
    
    // Connect nearby particles with lines
    function connectParticles() {
        const isDark = document.documentElement.classList.contains('dark');
        const baseColor = isDark ? '138, 43, 226' : '0, 0, 180'; // Purple for dark, blue for light
        const maxDistance = 180; 
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    // Set opacity based on distance with improved formula
                    const opacity = Math.pow(1 - (distance / maxDistance), 2) * 0.5;
                    ctx.strokeStyle = `rgba(${baseColor}, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        // Add special connections to mouse pointer
        if (mouseX !== undefined && mouseY !== undefined) {
            particles.forEach(particle => {
                const dx = mouseX - particle.x;
                const dy = mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = Math.pow(1 - (distance / 150), 2) * 0.8;
                    ctx.strokeStyle = `rgba(${baseColor}, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(mouseX, mouseY);
                    ctx.lineTo(particle.x, particle.y);
                    ctx.stroke();
                }
            });
        }
    }
    
    // Update particle colors on theme change
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        particles.forEach(particle => {
            particle.color = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)';
        });
    });
    
    // Start animation
    animate();
}// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Setup parallax effect
    setupParallax();
    
    // Setup smooth scrolling for navigation
    setupSmoothScrolling();
});

// Theme toggle functionality
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
        // Use device preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', prefersDark);
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Add transition effect when changing theme
        document.documentElement.style.transition = 'background-color 0.5s ease';
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 500);
    });
}

// Setup parallax effect
function setupParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Apply subtle parallax effect to sections based on their position
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Only apply if within view
            if (rect.top < windowHeight + 300 && rect.bottom > -300) {
                // Determine direction based on index (alternating left/right)
                const direction = index % 2 === 0 ? -1 : 1;
                
                // Calculate how far through the section we've scrolled
                const sectionProgress = 1 - (rect.top / windowHeight);
                
                // Apply subtle x-movement based on progress
                if (sectionProgress >= 0 && sectionProgress <= 1) {
                    const xOffset = direction * Math.sin(sectionProgress * Math.PI) * 10;
                    const opacity = 0.5 + (sectionProgress * 0.5);
                    
                    section.style.transform = `translateX(${xOffset}px)`;
                    section.style.opacity = opacity;
                }
            }
        });
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax')) || 0.2;
            const rect = element.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            
            if (rect.top < viewHeight && rect.bottom > 0) {
                const yPos = (rect.top - viewHeight / 2) * speed;
                const xPos = (rect.left - document.documentElement.clientWidth / 2) * (speed / 2);
                
                element.style.transform = `translate(${xPos}px, ${yPos}px)`;
            }
        });
    });
}

function setupScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal-element');
    
    // Assign alternating directions to elements
    revealElements.forEach((element, index) => {
        if (index % 2 === 0) {
            // Even indices come from left
            element.dataset.direction = 'left';
            element.style.transform = 'translateX(-100px) translateY(40px)';
        } else {
            // Odd indices come from right
            element.dataset.direction = 'right';
            element.style.transform = 'translateX(100px) translateY(40px)';
        }
        element.style.opacity = '0';
    });
    
    // Function to check scroll position and animate elements
    function checkScroll() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            // Calculate how far into the viewport the element is
            const visiblePct = 1 - (elementTop / windowHeight);
            
           
            if (elementTop < windowHeight * 0.9 && elementBottom > 0) {
                // Element is in view
                element.classList.add('revealed');
                
                // Calculate opacity based on scroll position
                const opacity = Math.min(Math.max(visiblePct * 3, 0), 1);
                
                // Calculate transform based on direction and scroll position
                const direction = element.dataset.direction;
                const transformX = direction === 'left' 
                    ? Math.min(0, -100 + (visiblePct * 150)) 
                    : Math.max(0, 100 - (visiblePct * 150));
                
                const transformY = Math.max(40 - (visiblePct * 60), 0);
                const blurAmount = Math.max(5 - (visiblePct * 12), 0);
                
                element.style.opacity = opacity;
                element.style.transform = `translateX(${transformX}px) translateY(${transformY}px)`;
                element.style.filter = `blur(${blurAmount}px)`;
            } else {
                // Element is out of view
                element.classList.remove('revealed');
                
                // Reset to original position based on direction
                const direction = element.dataset.direction;
                const transformX = direction === 'left' ? -100 : 100;
                
                element.style.opacity = 0;
                element.style.transform = `translateX(${transformX}px) translateY(40px)`;
                element.style.filter = 'blur(5px)';
            }
        });
        
        // Directly control project card animations based on scroll position
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect();
            const cardTop = cardRect.top;
            const windowHeight = window.innerHeight;
            
            // Assign direction if not already set
            if (!card.dataset.direction) {
                card.dataset.direction = index % 2 === 0 ? 'left' : 'right';
                const direction = card.dataset.direction;
                const transformX = direction === 'left' ? -100 : 100;
                card.style.transform = `translateX(${transformX}px)`;
                card.style.opacity = '0';
                card.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease';
            }
            
            // Calculate how much of the card is visible in the viewport
            // Make transition finish much earlier - as soon as card enters viewport
            const distanceFromTop = windowHeight - cardTop;
            // Accelerate the animation even more with a 0.4 multiplier (40% of window height)
            let percentVisible = Math.min(Math.max(distanceFromTop / (windowHeight * 0.4), 0), 1);
            
            // Smoother animation based on scroll position
            if (percentVisible > 0) {
                const direction = card.dataset.direction;
                const translateX = direction === 'left' 
                    ? -100 + (percentVisible * 100)
                    : 100 - (percentVisible * 100);
                
                const translateY = Math.max(30 - (percentVisible * 30), 0);
                const opacity = Math.min(percentVisible * 3, 1); // Even faster fade-in
                
                card.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
                card.style.opacity = opacity;
                
                // At full visibility, remove the transform to allow hover effects
                // Finish transition earlier at 60% visibility
                if (percentVisible > 0.6) {
                    card.style.transform = 'translateX(0) translateY(0)';
                    card.style.opacity = '1';
                }
            } else {
                // Reset when out of view
                const direction = card.dataset.direction;
                const transformX = direction === 'left' ? -100 : 100;
                card.style.transform = `translateX(${transformX}px) translateY(30px)`;
                card.style.opacity = '0';
            }
        });
    }
    
    // Run on scroll and initially
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Run once on page load
}

// Setup smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate header height for offset
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Project card interaction for mobile devices
function setupMobileCardInteraction() {
    // If we're on a touch device
    if ('ontouchstart' in window) {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // Prevent link navigation on first tap to show back of card
                if (!this.classList.contains('flipped')) {
                    e.preventDefault();
                    this.classList.add('flipped');
                }
            });
            
            // Reset flipped state when clicking elsewhere
            document.addEventListener('click', function(e) {
                if (!card.contains(e.target)) {
                    card.classList.remove('flipped');
                }
            });
        });
    }
}

// Create animated background particles
function setupAnimatedBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.color = getComputedStyle(document.documentElement).getPropertyValue('--text-muted');
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Bounce off edges
            if (this.x > canvas.width || this.x < 0) {
                this.speedX = -this.speedX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.speedY = -this.speedY;
            }
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particles
    const particles = [];
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 30)); // Adjust count based on screen size
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw all particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Connect particles with lines if they're close
        connectParticles();
        
        requestAnimationFrame(animate);
    }
    
    // Connect nearby particles with lines
    function connectParticles() {
        const maxDistance = 150;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    // Set opacity based on distance
                    const opacity = 1 - (distance / maxDistance);
                    ctx.strokeStyle = `rgba(100, 100, 150, ${opacity * 0.3})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Start animation
    animate();
}

// Initialize all functions with clean transitions
window.addEventListener('load', () => {
    setupMobileCardInteraction();
    setupAnimatedBackground();
    
    // Assign initial positions for sections for left/right transitions
    document.querySelectorAll('section').forEach((section, index) => {
        // Alternate left/right starting positions
        const direction = index % 2 === 0 ? -1 : 1;
        section.style.opacity = '0';
        section.style.transform = `translateX(${direction * 100}px)`;
        
        // Stagger the reveal of sections
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateX(0)';
        }, 200 * (index + 1));
    });
});