import { Component, signal, inject, OnInit, viewChild, ElementRef, afterNextRender, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import * as Matter from 'matter-js';
import anime from 'animejs';

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
  private engine?: Matter.Engine;
  private render?: Matter.Render;

  constructor() {
    afterNextRender(() => {
      this.initPhysics();
      this.revealMenu();
    });
  }

  ngOnInit() {
    this.api.getCookies().subscribe({
      next: (data) => this.cookies.set(data),
      error: (err) => console.error('Failed to load cookies:', err)
    });
  }

  ngOnDestroy() {
    if (this.render) {
      Matter.Render.stop(this.render);
      if (this.render.canvas.parentNode) {
        this.render.canvas.parentNode.removeChild(this.render.canvas);
      }
    }
    if (this.engine) Matter.Engine.clear(this.engine);
  }

  private revealMenu() {
    anime({
      targets: '.rustic-card',
      opacity: [0, 1],
      translateY: [30, 0],
      delay: anime.stagger(150),
      easing: 'easeOutQuad'
    });
  }

  private initPhysics() {
    const el = this.container()?.nativeElement;
    if (!el) return;

    this.engine = Matter.Engine.create({ gravity: { x: 0, y: 0.1 } });
    this.render = Matter.Render.create({
      element: el,
      engine: this.engine,
      options: {
        width: el.clientWidth,
        height: el.clientHeight,
        background: 'transparent',
        wireframes: false
      }
    });

    const ground = Matter.Bodies.rectangle(el.clientWidth / 2, el.clientHeight + 10, el.clientWidth, 20, { isStatic: true });
    Matter.World.add(this.engine.world, ground);

    const addCrumb = () => {
      if (!this.engine) return;
      const x = Math.random() * el.clientWidth;
      const crumb = Matter.Bodies.circle(x, -10, Math.random() * 3 + 2, {
        render: { fillStyle: '#8B4513' },
        frictionAir: 0.05
      });
      Matter.World.add(this.engine.world, crumb);
      if (this.engine.world.bodies.length > 40) Matter.World.remove(this.engine.world, this.engine.world.bodies[1]);
    };

    setInterval(addCrumb, 2000);
    
    Matter.Runner.run(Matter.Runner.create(), this.engine);
    Matter.Render.run(this.render);
  }
}
