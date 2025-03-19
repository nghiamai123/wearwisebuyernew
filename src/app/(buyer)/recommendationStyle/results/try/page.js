import Image from "next/image";

export default function DetailOutfit() {
  return (
    <>
      <div className="bg-white text-gray-800">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Recommend UI</h1>

          <div className="flex gap-20 mt-4">
            <div className="flex flex-col items-center">
              <Image
                alt="Placeholder image for Outfit 1"
                className="w-48 h-64 bg-gray-300"
                height="256"
                width="192"
                src="https://placehold.co/200x300"
              />
              <p className="mt-2">Outfit 1</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <Image
                width={300}
                height={100}
                alt="Small placeholder image representing Quần"
                className="w-28"
                src="https://storage.googleapis.com/a1aa/image/rKlgLVixifCLXCsIaotntkwwxK4VBXQx9CPxQbe5yOs.jpg"
              />
              <p className="mt-2">Quần</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <Image
                width={300}
                height={100}
                alt="Small placeholder image representing Áo"
                className="w-28"
                src="https://storage.googleapis.com/a1aa/image/xAbm5nok4ZmBFuWNUmHJzLn5LAfccNn3v94xOfuTP1E.jpg"
              />
              <p className="mt-2">Áo</p>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <Image
                width={300}
                height={100}
                alt="Small placeholder image representing Giày"
                className="w-28"
                src="https://storage.googleapis.com/a1aa/image/4W-LrojXEHHvKDccqsKNFqTK5hsyht_4xatuiAuBUrE.jpg"
              />
              <p className="mt-2">Giày</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
