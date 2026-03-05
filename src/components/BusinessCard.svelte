<script lang="ts">
  import { onMount } from 'svelte';
  import noiseImg from '../assets/backgrounds/noise.png';

  export let frontImage: string;
  export let backImage: string;

  let card: HTMLDivElement;
  let isFlipped = false; // 2. Show front first
  let hasInteracted = false;

  let rotateX = 0;
  let rotateY = 0;
  let glareX = 50;
  let glareY = 50;
  let glareOpacity = 0.1;
  let shadowX = 0;
  let shadowY = 10;

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
    shadowY = 10 + (rotateX * 1.5);

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glareX = (x / rect.width) * 100;
    glareY = (y / rect.height) * 100;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxViewportDist = Math.sqrt(window.innerWidth**2 + window.innerHeight**2);
    glareOpacity = Math.max(0.05, 0.3 - (distance / (maxViewportDist * 0.4)));
  }

  function toggleFlip() {
    isFlipped = !isFlipped;
    hasInteracted = true;
  }

  onMount(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  });
</script>

<div class="card-outer-container flex flex-col items-center gap-6 w-full animate-fly-in">
  <div class="card-container flex justify-center perspective-1500 w-full">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      bind:this={card}
      class="tilt-layer relative w-full max-w-[450px] aspect-[1.75/1] cursor-pointer select-none idle-float"
      on:click={toggleFlip}
      style="transform: rotateX({rotateX}deg) rotateY({rotateY}deg) rotateZ(-4deg);"
    >
      <div 
        class="flip-inner relative w-full h-full rounded-[4px] transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]" 
        class:flipped={isFlipped}
        style="box-shadow: {shadowX}px {shadowY}px 30px -5px rgba(0, 0, 0, 0.3);"
      >
        <!-- Front Side -->
        <div class="card-face card-front rounded-[4px] overflow-hidden bg-white dark:bg-neutral-800">
          <img src={frontImage} alt="Front" class="absolute inset-0 w-full h-full object-cover" />
          <div class="absolute inset-0 paper-texture opacity-[0.1] pointer-events-none mix-blend-multiply dark:mix-blend-screen" style="background-image: url('{noiseImg}')"></div>
          <div 
            class="glare pointer-events-none absolute inset-0 mix-blend-overlay"
            style="background: radial-gradient(circle at {glareX}% {glareY}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 75%); opacity: {glareOpacity};"
          ></div>
        </div>

        <!-- Back Side -->
        <div class="card-face card-back rounded-[4px] overflow-hidden bg-white dark:bg-neutral-800">
          <img src={backImage} alt="Back" class="absolute inset-0 w-full h-full object-cover" />
          <div class="absolute inset-0 paper-texture opacity-[0.1] pointer-events-none mix-blend-multiply dark:mix-blend-screen" style="background-image: url('{noiseImg}')"></div>
          <div 
            class="glare pointer-events-none absolute inset-0 mix-blend-overlay"
            style="background: radial-gradient(circle at {glareX}% {glareY}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 75%); opacity: {glareOpacity};"
          ></div>
        </div>
      </div>
    </div>
  </div>

  <!-- 1. Click Hint -->
  <div class="click-hint flex items-center gap-2 text-xs font-medium text-neutral-400 dark:text-neutral-500 transition-opacity duration-500" class:opacity-0={hasInteracted}>
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-pulse">
      <path d="m9 18 6-6-6-6"/>
    </svg>
    <span>Click to flip card</span>
  </div>
</div>

<style>
  .perspective-1500 {
    perspective: 1500px;
  }

  .tilt-layer {
    transform-style: preserve-3d;
    transition: transform 0.1s ease-out;
  }

  /* 1. Idle Floating Animation */
  .idle-float {
    animation: float 6s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) rotateX(0) rotateY(0) rotateZ(-4deg); }
    50% { transform: translateY(-10px) rotateX(2deg) rotateY(-2deg) rotateZ(-3deg); }
  }

  .flip-inner {
    transform-style: preserve-3d;
    width: 100%;
    height: 100%;
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
    -webkit-backface-visibility: hidden;
  }

  .card-back {
    transform: rotateY(180deg);
  }

  .paper-texture {
    background-size: 150px 150px;
    background-repeat: repeat;
  }

  @keyframes flyIn {
    0% {
      opacity: 0;
      transform: translate(100px, -100px) rotateZ(10deg);
    }
    100% {
      opacity: 1;
      transform: translate(0, 0) rotateZ(0deg);
    }
  }

  .animate-fly-in {
    animation: flyIn 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
</style>
