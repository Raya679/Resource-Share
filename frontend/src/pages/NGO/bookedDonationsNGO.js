import { useEffect } from "react";
import Navbar from "../../components/navbar";
import { useBookDonationsContext } from "../../hooks/useBookDonationsContext";
import { useFoodDonationsContext } from "../../hooks/useFoodDonationsContext";
import { useClothesDonationsContext } from "../../hooks/useClothesDonationsContext"; // Assuming you have this hook for clothes
import { useAuthContextNGO } from "../../hooks/useAuthContextNGO";

const NGODonationsDashboard = () => {
  const { bookDonations, dispatch: bookDispatch } = useBookDonationsContext();
  const { foodDonations, dispatch: foodDispatch } = useFoodDonationsContext();
  const { clothesDonations, dispatch: clothesDispatch } = useClothesDonationsContext(); // Assuming clothes donations context
  const { ngo } = useAuthContextNGO();

  // Fetch booked book donations
  useEffect(() => {
    const fetchBookedBookDonations = async () => {
      const response = await fetch("/api/NGO/getBookedBooks", {
        headers: { Authorization: `Bearer ${ngo.token}` },
      });
      const json = await response.json();
      if (response.ok) {
        bookDispatch({ type: "SET_BOOK_DONATIONS", payload: json });
      }
    };

    if (ngo) {
      fetchBookedBookDonations();
    }
  }, [bookDispatch, ngo]);

  // Fetch booked food donations
  useEffect(() => {
    const fetchBookedFoodDonations = async () => {
      const response = await fetch("/api/NGO/getBookedFood", {
        headers: { Authorization: `Bearer ${ngo.token}` },
      });
      const json = await response.json();
      if (response.ok) {
        foodDispatch({ type: "SET_FOOD_DONATIONS", payload: json });
      }
    };

    if (ngo) {
      fetchBookedFoodDonations();
    }
  }, [foodDispatch, ngo]);

  // Fetch booked clothes donations
  useEffect(() => {
    const fetchBookedClothesDonations = async () => {
      const response = await fetch("/api/NGO/getBookedClothes", {
        headers: { Authorization: `Bearer ${ngo.token}` },
      });
      const json = await response.json();
      if (response.ok) {
        clothesDispatch({ type: "SET_CLOTHES_DONATIONS", payload: json });
      }
    };

    if (ngo) {
      fetchBookedClothesDonations();
    }
  }, [clothesDispatch, ngo]);

  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      <Navbar />
      <div className="flex flex-grow items-center justify-center">
        <div className="container mx-auto p-8 max-w-full">
          <h1 className="text-3xl font-bold text-center text-teal-500 mb-8">
            Booked Donations Dashboard
          </h1>

          {/* Outer Scrollable Container */}
          <div className="overflow-y-auto max-h-[calc(100vh-4rem)]">

            {/* Donations Sections in Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Book Donations Section */}
              <div className="p-6 bg-white border border-blue-400 rounded-lg shadow-lg h-[500px]">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Book Donations Booked</h2>
                <div className="overflow-y-auto" style={{ height: "calc(100% - 2.5rem)" }}>
                  <ul>
                    {bookDonations &&
                      bookDonations.map((donation) => (
                        <li key={donation._id} className="mb-4">
                          <div className="relative border p-4 rounded-md shadow-md bg-blue-50">
                            <p><strong>Book Description:</strong> {donation.bookDescription}</p>
                            <p><strong>Age Group:</strong> {donation.ageGroup}</p>
                            <p><strong>Address:</strong> {donation.address}</p>
                            <p><strong>Contact:</strong> {donation.contact}</p>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              {/* Food Donations Section */}
              <div className="p-6 bg-white border border-green-400 rounded-lg shadow-lg h-[500px]">
                <h2 className="text-2xl font-bold text-green-600 mb-4">Food Donations Booked</h2>
                <div className="overflow-y-auto" style={{ height: "calc(100% - 2.5rem)" }}>
                  <ul>
                    {foodDonations &&
                      foodDonations.map((donation) => (
                        <li key={donation._id} className="mb-4">
                          <div className="relative border p-4 rounded-md shadow-md bg-green-50">
                            <p><strong>Food Item:</strong> {donation.foodItem}</p>
                            <p><strong>Quantity:</strong> {donation.quantity}</p>
                            <p><strong>Expiry Date:</strong> {donation.expiry}</p>
                            <p><strong>Address:</strong> {donation.address}</p>
                            <p><strong>Contact:</strong> {donation.contact}</p>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              {/* Clothes Donations Section */}
              <div className="p-6 bg-white border border-purple-400 rounded-lg shadow-lg h-[500px]">
                <h2 className="text-2xl font-bold text-purple-600 mb-4">Clothes Donations Booked</h2>
                <div className="overflow-y-auto" style={{ height: "calc(100% - 2.5rem)" }}>
                  <ul>
                    {clothesDonations &&
                      clothesDonations.map((donation) => (
                        <li key={donation._id} className="mb-4">
                          <div className="relative border p-4 rounded-md shadow-md bg-purple-50">
                            <p><strong>Clothes Description:</strong> {donation.clothesDescription}</p>
                            <p><strong>Size:</strong> {donation.size}</p>
                            <p><strong>Quantity:</strong> {donation.quantity}</p>
                            <p><strong>Address:</strong> {donation.address}</p>
                            <p><strong>Contact:</strong> {donation.contact}</p>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGODonationsDashboard;
