import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { Rate } from "antd";
import CartReview from "./CardReview";

export default function Reviews({title}) {
  return (
    <div className="bg-white text-gray-800 my-8">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          {title}
        </h1>
        <div className="flex justify-center items-center space-x-4">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full cursor-pointer">
            <FaArrowLeft />
          </div>
          <div className="flex space-x-4 overflow-x-auto">
            {[
              {
                name: "Sarah M.",
                review:
                  "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
              },
              {
                name: "Alex K.",
                review:
                  "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
              },
              {
                name: "James L.",
                review:
                  "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
              },
            ].map((customer, index) => (
              <CartReview key={index} author={customer.name} comment={customer.review} numStar={5}/>
            ))}
          </div>
          <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full cursor-pointer">
            <FaArrowRight />
          </div>
        </div>
      </div>
    </div>
  );
}
