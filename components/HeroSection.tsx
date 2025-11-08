import Image from "next/image"
import { Button } from "./ui/button"
import Heroshoe from '../public/hero-shoe.png'
import Hero_bg from '../public/hero-bg.png'

export const HeroSection = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image - Full coverage */}
      <Image 
        src={Hero_bg} 
        alt="bg-image"
        fill
        className="absolute inset-0 z-0 object-cover"
        priority
      />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center min-h-screen px-6 py-12 lg:px-16 lg:py-0">
        
        {/* Text Section - Full width on mobile, left on desktop */}
        <div className="w-full lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
          <p className="text-lg md:text-xl font-medium text-gray-700 mb-3">Bold & Sporty</p>
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold leading-tight mb-4">
            Style That Moves With You.
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
            Not just style. Not just comfort. Footwear that effortlessly moves with your every step.
          </p>
          <Button className="rounded-full px-8 py-6 text-lg font-medium">
            Find Your Shoe
          </Button>
        </div>

        {/* Shoe Image - Below text on mobile, right side on desktop */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <Image 
            src={Heroshoe} 
            alt="front-image"
            className="relative z-20 w-full h-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>
    </div>
  )
}