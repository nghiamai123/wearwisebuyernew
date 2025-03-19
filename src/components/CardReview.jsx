import { FaCheckCircle } from "react-icons/fa";
import { Rate } from 'antd';

export default function CartReview({numStar, author, comment}) {
  return (
    <>
      <div className="flex-shrink-0 w-80 p-4 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-2">
          <div className="flex items-center">
              <Rate allowHalf value={numStar} disabled/>
          </div>
        </div>
        <h2 className="flex text-lg text-left font-bold mb-2">
          {author}<FaCheckCircle className="text-green-500"/>
        </h2>
        <p className="text-gray-700 text-left">
          {comment}
        </p>
      </div>
    </>
  );
}
