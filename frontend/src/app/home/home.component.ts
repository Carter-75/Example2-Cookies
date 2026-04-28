import { Component, signal, inject, OnInit, viewChild, ElementRef, afterNextRender, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  protected cookies = signal<any[]>([]);

  private container = viewChild<ElementRef<HTMLDivElement>>('scene');
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private renderer?: THREE.WebGLRenderer;
  private particles: THREE.Points[] = [];
  private animationFrameId?: number;
  private lenis?: Lenis;

  constructor() {
    afterNextRender(() => {
      this.initLenis();
      this.initThreeJS();
      
      setTimeout(() => {
        this.initGSAP();
        this.initMagneticButtons();
      }, 100);

      window.addEventListener('resize', this.handleResize);
    });
  }

  ngOnInit() {
    this.api.getCookies().subscribe({
      next: (data) => this.cookies.set(data),
      error: (err) => console.error('Failed to load cookies:', err)
    });
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.renderer) this.renderer.dispose();
    if (this.lenis) this.lenis.destroy();
    ScrollTrigger.getAll().forEach(t => t.kill());
  }

  private initLenis() {
    this.lenis = new Lenis({
      duration: 1.5, // slightly slower for rustic feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    const raf = (time: number) => {
      this.lenis?.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
  }

  private initGSAP() {
    gsap.utils.toArray('.gs-reveal').forEach((elem: any) => {
      gsap.fromTo(elem, 
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: elem,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }

  private initMagneticButtons() {
    const buttons = document.querySelectorAll('.mag-btn');
    
    buttons.forEach((btn: any) => {
      btn.addEventListener('mousemove', (e: MouseEvent) => {
        const position = btn.getBoundingClientRect();
        const x = e.pageX - position.left - position.width / 2;
        const y = e.pageY - position.top - position.height / 2;

        gsap.to(btn, {
          x: x * 0.3,
          y: y * 0.5,
          duration: 0.8,
          ease: 'power3.out'
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.3)'
        });
      });
    });
  }

  private initThreeJS() {
    const el = this.container()?.nativeElement;
    if (!el) return;

    this.scene = new THREE.Scene();
    
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 20;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    el.appendChild(this.renderer.domElement);

    // Create flour dust particles
    const geometry = new THREE.BufferGeometry();
    const particlesCount = 300;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 50;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const material = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x8B4513, // Rustic brown
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(geometry, material);
    this.scene.add(particlesMesh);
    this.particles.push(particlesMesh);

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);
      
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;

      // Subtle parallax effect with mouse
      gsap.to(particlesMesh.rotation, {
        x: mouseY * 0.1,
        y: mouseX * 0.1,
        duration: 2,
        ease: 'power2.out'
      });

      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };

    animate();

    // cleanup listener on destroy
    const origDestroy = this.ngOnDestroy.bind(this);
    this.ngOnDestroy = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      origDestroy();
    };
  }

  private handleResize = () => {
    if (this.camera && this.renderer) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  };
}
