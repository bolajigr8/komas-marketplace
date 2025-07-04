import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Product } from "@/lib/types";
import ProductCard from "../General/ProductCard";

interface FeaturedProductsProps {
  products: Product[];
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
}) => {
  return (
    <Swiper
      modules={[Navigation, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      navigation
      autoplay={{ delay: 5000 }}
      breakpoints={{
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }}
      className="featured-products-swiper"
    >
      {products.map((product) => (
        <SwiperSlide key={product._id}>
          <ProductCard product={product} showCartBtn />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
