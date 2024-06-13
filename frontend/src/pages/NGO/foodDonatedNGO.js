import { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import { useFoodDonationsContext } from "../../hooks/useFoodDonationsContext";
import { useAuthContextNGO } from "../../hooks/useAuthContextNGO";
import "../../css/NGOFoodDonationsDashboard.css"// Import CSS file for animations

const NGOFoodDonationsDashboard = () => {
  const { foodDonations, dispatch } = useFoodDonationsContext();
  const { ngo } = useAuthContextNGO();
  const [notification, setNotification] = useState(null);

  // Get food donations
  useEffect(() => {
    const fetchFoodDonations = async () => {
      const response = await fetch("/api/NGO/getFood", {
        headers: { Authorization: `Bearer ${ngo.token}` },
      });
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "SET_FOOD_DONATIONS", payload: json });
      }
    };

    if (ngo) {
      fetchFoodDonations();
    }
  }, [dispatch, ngo]);

  // Book food donation
  const handleBook = async (id) => {
    if (!ngo) {
      console.log("You must be logged in");
      return;
    }

    const response = await fetch(`/api/NGO/bookFood/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${ngo.token}`,
      },
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "BOOK_FOOD_DONATION", payload: json });

      // Show notification for 5 seconds
      setNotification(`Food donation (${json.foodItem}) successfully booked!`);

      // Automatically hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } else {
      console.log("Error booking donation:", response.statusText);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      <Navbar />
      <div className="flex flex-grow items-center justify-center">
        <div className="container mx-auto p-8 max-w-4xl">
          <h1 className="text-3xl font-bold text-center text-teal-500 mb-8">
            Food Donations
          </h1>
          <div className="flex justify-center">
            <div className="w-full p-6 bg-white border border-green-400 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                Food Donations Made
              </h2>
              <div
                className="overflow-y-auto"
                style={{
                  height: `calc(100% - 2.5rem)`,
                  scrollbarWidth: "none",
                }}
              >
                <ul>
                  {foodDonations &&
                    foodDonations.map((donation) => (
                      <li key={donation._id} className="mb-4">
                        <div className="relative border p-4 rounded-md shadow-md bg-green-50">
                          <div>
                            <p>
                              <strong>Food Item:</strong> {donation.foodItem}
                            </p>
                            <p>
                              <strong>Quantity:</strong> {donation.quantity}
                            </p>
                            <p>
                              <strong>Expiry Date:</strong> {donation.expiry}
                            </p>
                            <p>
                              <strong>Address:</strong> {donation.address}
                            </p>
                            <p>
                              <strong>Contact:</strong> {donation.contact}
                            </p>
                          </div>
                          {!donation.booked && (
                            <button
                              className="absolute bottom-2 right-2 text-white bg-green-500 hover:bg-green-600 rounded-md px-4 py-1"
                              onClick={() => handleBook(donation._id)}
                            >
                              Book
                            </button>
                          )}
                          {donation.booked && (
                            <p className="absolute bottom-2 right-2 text-green-500">
                              Booked
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
          {/* Notification */}
          {notification && (
            <div className="notification animate-notification">
              {notification}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NGOFoodDonationsDashboard;
