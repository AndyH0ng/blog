<script lang="ts">
  import { onMount } from 'svelte';
  import noiseImg from '../assets/backgrounds/noise.png';

  export let frontImage: string;
  export let backImage: string;

  let card: HTMLDivElement;
  let isFlipped = true; // Starts with back side

  let rotateX = 0;
  let rotateY = 0;
  let glareX = 0;
  let glareY = 0;
  let opacity = 0;
  let shadowX = 0;
  let shadowY = 0;

  function handleMouseMove(e: MouseEvent) {
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    const deltaX = e.clientX - cardCenterX;
    const deltaY = e.clientY - cardCenterY;
    
    const normX = deltaX / (window.innerWidth / 2);
    const normY = deltaY / (window.innerHeight / 2);
    
    const tiltAmount = 10;
    
    rotateY = Math.max(-tiltAmount, Math.min(tiltAmount, normX * tiltAmount));
    rotateX = Math.max(-tiltAmount, Math.min(tiltAmount, -normY * tiltAmount));
    
    shadowX = -rotateY * 1.5;
    shadowY = rotateX * 1.5;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glareX = (x / rect.width) * 100;
    glareY = (y / rect.height) * 100;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxViewportDist = Math.sqrt(window.innerWidth**2 + window.innerHeight**2);
    opacity = Math.max(0.05, 0.3 - (distance / (maxViewportDist * 0.4)));
  }

  function toggleFlip() {
    isFlipped = !isFlipped;
  }

  onMount(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  });
</script>

<div class="card-container py-12 flex justify-center perspective-1500">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    bind:this={card}
    class="tilt-layer relative w-full max-w-[450px] aspect-[1.75/1] cursor-pointer select-none"
    on:click={toggleFlip}
    style="transform: rotateX({rotateX}deg) rotateY({rotateY}deg); --shadow-x: {shadowX}px; --shadow-y: {shadowY}px;"
  >
    <div class="flip-inner relative w-full h-full shadow-2xl rounded-[4px]" class:flipped={isFlipped}>
      <!-- Front Side -->
      <div class="card-face card-front rounded-[4px] overflow-hidden">
        <img src={frontImage} alt="Business Card Front" class="absolute inset-0 w-full h-full object-cover" />
        <div class="absolute inset-0 paper-texture opacity-[0.15] pointer-events-none mix-blend-multiply dark:mix-blend-screen" style="--noise-url: url('{noiseImg}')"></div>
        <div 
          class="glare pointer-events-none absolute inset-0 mix-blend-overlay"
          style="background: radial-gradient(circle at var(--glare-x) var(--glare-y), rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%); opacity: {opacity}; --glare-x: {glareX}%; --glare-y: {glareY}%"
        ></div>
      </div>

      <!-- Back Side -->
      <div class="card-face card-back rounded-[4px] overflow-hidden">
        <img src={backImage} alt="Business Card Back" class="absolute inset-0 w-full h-full object-cover" />
        <div class="absolute inset-0 paper-texture opacity-[0.15] pointer-events-none mix-blend-multiply dark:mix-blend-screen" style="--noise-url: url('{noiseImg}')"></div>
        <div 
          class="glare pointer-events-none absolute inset-0 mix-blend-overlay"
          style="background: radial-gradient(circle at var(--glare-x) var(--glare-y), rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%); opacity: {opacity}; --glare-x: {glareX}%; --glare-y: {glareY}%"
        ></div>
      </div>
    </div>
  </div>
</div>

<style>
  .perspective-1500 {
    perspective: 1500px;
  }

  .tilt-layer {
    transform-style: preserve-3d;
    /* Tilt should be instant for mouse movement */
    transition: transform 0.1s ease-out;
    filter: drop-shadow(var(--shadow-x) var(--shadow-y) 20px rgba(0, 0, 0, 0.3));
  }

  .flip-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform-style: preserve-3d;
  }

  .flip-inner.flipped {
    transform: rotateY(180deg);
  }

  .card-face {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    background-color: white;
    -webkit-backface-visibility: hidden;
  }

  .card-back {
    transform: rotateY(180deg);
  }

  .paper-texture {
    background-image: var(--noise-url);
    background-size: 150px 150px;
    background-repeat: repeat;
  }
</style>
