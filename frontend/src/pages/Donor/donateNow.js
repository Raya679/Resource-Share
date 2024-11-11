import { Link } from "react-router-dom";
import Navbar from "../../components/navbar";
import booksImage from "../../pictures/book-donation.png"
import foodImage from "../../pictures/food-donation.png"
import clothesImage from "../../pictures/clothes-donation.png"; 

const DonateNow = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-grow items-center justify-center">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center text-teal-500 mb-8">Choose a Donation Category</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/donateBook" className="group flex-shrink-0">
              <div className="p-6 bg-blue-50 border border-blue-400 rounded-lg shadow-lg hover:bg-blue-100 transition duration-300 flex flex-col h-full">
                <img src={booksImage} alt="Books" className="h-48 w-full object-contain rounded-md mb-4"/>
                <h2 className="text-2xl font-bold text-blue-600 group-hover:text-blue-700">Donate Books</h2>
                <p className="mt-4 text-gray-600">Contribute to our library and share the joy of reading with others.</p>
              </div>
            </Link>
            <Link to="/donateFood" className="group flex-shrink-0">
              <div className="p-6 bg-green-50 border border-green-400 rounded-lg shadow-lg hover:bg-green-100 transition duration-300 flex flex-col h-full">
                <img src={foodImage} alt="Food" className="h-48 w-full object-contain rounded-md mb-4"/>
                <h2 className="text-2xl font-bold text-green-600 group-hover:text-green-700">Donate Food</h2>
                <p className="mt-4 text-gray-600">Help provide nutritious meals to those in need and make a difference in their lives.</p>
              </div>
            </Link>
            <Link to="/donateClothes" className="group flex-shrink-0">
              <div className="p-6 bg-purple-50 border border-purple-400 rounded-lg shadow-lg hover:bg-purple-100 transition duration-300 flex flex-col h-full">
                <img src={clothesImage} alt="Clothes" className="h-48 w-full object-contain rounded-md mb-4"/>
                <h2 className="text-2xl font-bold text-purple-600 group-hover:text-purple-700">Donate Clothes</h2>
                <p className="mt-4 text-gray-600">Support those in need by donating clothes and help them stay warm and comfortable.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateNow;
