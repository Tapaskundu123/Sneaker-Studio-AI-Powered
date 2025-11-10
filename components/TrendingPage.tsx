import Image from 'next/image';
import timage_1 from '../public/trending-1.png';
import timage_2 from '../public/trending-2.png';
import timage_3 from '../public/trending-3.png';
import { Button } from './ui/button';

const TrendingPage = () => {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900">
          Trending Now
        </h1>

        {/* First Trending Card - Full Width, Fixed Height for Visibility */}
        <div className="relative w-full mb-8 lg:mb-12 rounded-2xl overflow-hidden shadow-2xl group">
          {/* Height Wrapper for Image */}
          <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px]">
            <Image
              src={timage_1}
              alt="REACT PRESTO – Trending Shoe"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </div>
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12 text-white">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 leading-tight">
              REACT PRESTO
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 max-w-2xl opacity-90">
              with React foam for the most comfortable Presto ever
            </p>
            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-base sm:text-lg font-semibold bg-white text-black hover:bg-gray-100 transition-all"
            >
              Shop Now
            </Button>
          </div>
          {/* Optional: Top-right badge */}
          <div className="absolute top-6 right-6 bg-white text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            NEW
          </div>
        </div>

        {/* Second and Third Trending Cards - Side by Side on Desktop, Stacked on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Second Card - Half Width */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
            <Image
              src={timage_2}
              alt="AIR MAX 90 – Trending Shoe"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3 leading-tight">
                AIR MAX 90
              </h2>
              <p className="text-base sm:text-lg md:text-xl mb-4 md:mb-6 opacity-90">
                Iconic design meets modern comfort
              </p>
              <Button
                size="sm"
                className="rounded-full px-6 py-4 text-sm sm:text-base font-semibold bg-white text-black hover:bg-gray-100 transition-all"
              >
                Shop Now
              </Button>
            </div>
            <div className="absolute top-4 right-4 bg-white text-black px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
              HOT
            </div>
          </div>

          {/* Third Card - Half Width */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
            <Image
              src={timage_3}
              alt="DUNK LOW – Trending Shoe"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3 leading-tight">
                DUNK LOW
              </h2>
              <p className="text-base sm:text-lg md:text-xl mb-4 md:mb-6 opacity-90">
                Classic style with premium materials
              </p>
              <Button
                size="sm"
                className="rounded-full px-6 py-4 text-sm sm:text-base font-semibold bg-white text-black hover:bg-gray-100 transition-all"
              >
                Shop Now
              </Button>
            </div>
            <div className="absolute top-4 right-4 bg-white text-black px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
              SALE
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingPage;