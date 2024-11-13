import { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import { useClothesDonationsContext } from "../../hooks/useClothesDonationsContext";
import { useAuthContextNGO } from "../../hooks/useAuthContextNGO";
import "../../css/NGODonationsDashboard.css";

const NGOClothesDonationsDashboard = () => {
  const { clothesDonations, dispatch } = useClothesDonationsContext();
  const { ngo } = useAuthContextNGO();
  const [notification, setNotification] = useState(null);

  // Get clothes donations
  useEffect(() => {
    const fetchClothesDonations = async () => {
      const response = await fetch("/api/NGO/getClothes", {
        headers: { Authorization: `Bearer ${ngo.token}` },
      });
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "SET_CLOTHES_DONATIONS", payload: json });
      }
    };

    if (ngo) {
      fetchClothesDonations();
    }
  }, [dispatch, ngo, clothesDonations]);

  // Book clothes donation
  const handleBook = async (id) => {
    if (!ngo) {
      console.log("You must be logged in");
      return;
    }

    const response = await fetch(`/api/NGO/bookClothes/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${ngo.token}`,
      },
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "BOOK_CLOTHES_DONATION", payload: json });

      setNotification(`Clothes donation (${json.clothesDescription}) successfully booked!`);
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } else {
      console.log("Error booking donation:", response.statusText);
    }
  };

      const renderStars = (rating) => {
        const numRating = parseFloat(rating); 
        let stars = '';
        for (let i = 0; i < 5; i++) {
          if (i < Math.floor(numRating)) {
            stars += '★'; 
          } else if (i < Math.ceil(numRating)) {
            stars += '☆'; 
          } else {
            stars += '☆'; 
          }
        }
        return stars;
      };

  return (
    <div className="min-h-screen flex flex-col bg-purple-50">
      <Navbar />
      <div className="flex flex-grow items-center justify-center">
        <div className="container mx-auto p-8 max-w-4xl">
          <h1 className="text-3xl font-bold text-center text-purple-600 mb-8">
            Book Clothes Donations
          </h1>
          <div className="flex justify-center">
            <div className="w-full p-6 bg-white border border-purple-400 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">
                Clothes Donations Made
              </h2>
              <div
                className="overflow-y-auto"
                style={{
                  height: `calc(100% - 2.5rem)`,
                  scrollbarWidth: "none",
                }}
              >
                <ul>
                  {clothesDonations &&
                    clothesDonations.map((donation) => (
                      <li key={donation._id} className="mb-4">
                        <div className="relative border p-4 rounded-md shadow-md bg-purple-100">
                          <div>
                            <p>
                              <strong>Clothes Description:</strong> {donation.clothesDescription}
                            </p>
                            <p>
                              <strong>Age Group:</strong> {donation.ageGroup}
                            </p>
                            <p>
                              <strong>Address:</strong> {donation.address}
                            </p>
                            <p>
                              <strong>Contact:</strong> {donation.contact}
                            </p>
                            <p>
                              <strong>Donor Rating:</strong> {renderStars(donation.user_avg_rating)} ({donation.user_avg_rating})
                            </p>
                          </div>
                          {!donation.booked && (
                            <button
                              className="absolute bottom-2 right-2 text-white bg-purple-500 hover:bg-purple-600 rounded-md px-4 py-1"
                              onClick={() => handleBook(donation._id)}
                            >
                              Book
                            </button>
                          )}
                          {donation.booked && (
                            <p className="absolute bottom-2 right-2 text-purple-600">
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
            <div className="notification animate-notification text-purple-700">
              {notification}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NGOClothesDonationsDashboard;
