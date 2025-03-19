import Image from "next/image";
export default function FilterPanel() {
  return (
    <>
      <div className="bg-gray-100 flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
          <h1 className="text-center text-2xl font-semibold mb-6">
            BROWSE BY dress STYLE
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative h-48 sm:col-span-1">
              <Image
                alt="Casual style placeholder"
                className="w-full h-full object-cover rounded-lg"
                height="200"
                src="https://storage.googleapis.com/a1aa/image/AjHIDInIdaYsqAKCACg3QJH0pL2tcUsQEIXuhLYtxwk.jpg"
                width="300"
              />
              <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
                <span className="text-xl font-medium">Casual</span>
              </div>
            </div>
            <div className="relative h-48 sm:col-span-2">
              <Image
                alt="Formal style placeholder"
                className="w-full h-full object-cover rounded-lg"
                height="200"
                src="https://storage.googleapis.com/a1aa/image/D6VYi18xG0BsjQQDHBCgnl9NH33iigCm5rKLd-ZkQPM.jpg"
                width="600"
              />
              <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
                <span className="text-xl font-medium">Formal</span>
              </div>
            </div>
            <div className="relative h-48 sm:col-span-2">
              <Image
                alt="Party style placeholder"
                className="w-full h-full object-cover rounded-lg"
                height="200"
                src="https://storage.googleapis.com/a1aa/image/PqB8r0UW2NMBbXa0wDtNPsVT3xWGBenhW5jk7pjvWnk.jpg"
                width="600"
              />
              <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
                <span className="text-xl font-medium">Party</span>
              </div>
            </div>
            <div className="relative h-48 sm:col-span-1">
              <Image
                alt="Gym style placeholder"
                className="w-full h-full object-cover rounded-lg"
                height="200"
                src="https://storage.googleapis.com/a1aa/image/fcK0Ef8bGGiFHrBR4ZuL7Y0_15vDmTMknYhynvklKs0.jpg"
                width="300"
              />
              <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
                <span className="text-xl font-medium">Gym</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
