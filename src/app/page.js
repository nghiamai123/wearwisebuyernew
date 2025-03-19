import Slider from "../components/Slider";
import ListProducts from "../components/ListProducts";
import FilterPanel from "../components/FilterPanel";
import Reviews from "@/components/Reviews";
import InteractiveLogoMarquee from "@/components/LogoMarquee";

export default function Home() {
  return (
    <>
      <Slider></Slider>
      <InteractiveLogoMarquee />
      <ListProducts title="NEW ARRIVALS"></ListProducts>
      <hr />
      <ListProducts title="Top Selling"></ListProducts>
      <FilterPanel></FilterPanel>
      <Reviews title={"OUR HAPPY CUSTOMERS"}></Reviews>
    </>
  );
}
