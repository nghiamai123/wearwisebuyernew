import Image from "next/image";
import Link from "next/link";

export default function result() {
  return (
    <>
      <div className="bg-white text-gray-800">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Recommend UI</h1>
          <div className="flex gap-20 mt-4">
            <div className="flex flex-col items-center">
              <Link
                href={"http://localhost:3000/recommendationStyle/results/try"}
              >
                <Image
                  alt="Placeholder image for Outfit 1"
                  className="w-48 h-64 bg-gray-300"
                  height="256"
                  src="https://placehold.co/200x300"
                  width="192"
                />
              </Link>
              <p className="mt-2">Outfit 1</p>
            </div>
            <div className="flex flex-col items-center">
              <Link
                href={"http://localhost:3000/recommendationStyle/results/try"}
              >
                <Image
                  alt="Placeholder image for Outfit 1"
                  className="w-48 h-64 bg-gray-300"
                  height="256"
                  src="https://placehold.co/200x300"
                  width="192"
                />
              </Link>
              <p className="mt-2">Outfit 1</p>
            </div>
            <div className="flex flex-col items-center">
              <Link
                href={"http://localhost:3000/recommendationStyle/results/try"}
              >
                <Image
                  alt="Placeholder image for Outfit 1"
                  className="w-48 h-64 bg-gray-300"
                  height="256"
                  src="https://placehold.co/200x300"
                  width="192"
                />
              </Link>
              <p className="mt-2">Outfit 1</p>
            </div>
            <div className="flex flex-col items-center">
              <Link
                href={"http://localhost:3000/recommendationStyle/results/try"}
              >
                <Image
                  alt="Placeholder image for Outfit 1"
                  className="w-48 h-64 bg-gray-300"
                  height="256"
                  src="https://placehold.co/200x300"
                  width="192"
                />
              </Link>
              <p className="mt-2">Outfit 1</p>
            </div>
            <div className="flex flex-col items-center">
              <Link
                href={"http://localhost:3000/recommendationStyle/results/try"}
              >
                <Image
                  alt="Placeholder image for Outfit 1"
                  className="w-48 h-64 bg-gray-300"
                  height="256"
                  src="https://placehold.co/200x300"
                  width="192"
                />
              </Link>
              <p className="mt-2">Outfit 1</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
