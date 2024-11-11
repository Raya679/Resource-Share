import { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import { useBookDonationsContext } from "../../hooks/useBookDonationsContext";
import { useAuthContextNGO } from "../../hooks/useAuthContextNGO";
import "../../css/NGODonationsDashboard.css"; 

const NGOBookDonationsDashboard = () => {
  const { bookDonations, dispatch } = useBookDonationsContext();
  const { ngo } = useAuthContextNGO();
  const [notification, setNotification] = useState(null);

  // Get book donations
  useEffect(() => {
    const fetchBookDonations = async () => {
      const response = await fetch("/api/NGO/getBooks", {
        headers: { Authorization: `Bearer ${ngo.token}` },
      });
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "SET_BOOK_DONATIONS", payload: json });
      }
    };

    if (ngo) {
      fetchBookDonations();
    }
  }, [dispatch, ngo]);

  // Book book donation
  const handleBook = async (id) => {
    if (!ngo) {
      console.log("You must be logged in");
      return;
    }

    const response = await fetch(`/api/NGO/bookBooks/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${ngo.token}`,
      },
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "BOOK_BOOK_DONATION", payload: json });

      // Show notification for 5 seconds
      setNotification(`Book donation (${json.bookDescription}) successfully booked!`);

      // Automatically hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } else {
      console.log("Error booking donation:", response.statusText);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <Navbar />
      <div className="flex flex-grow items-center justify-center">
        <div className="container mx-auto p-8 max-w-4xl">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
            Book Donations
          </h1>
          <div className="flex justify-center">
            <div className="w-full p-6 bg-white border border-blue-400 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">
                Book Donations Made
              </h2>
              <div
                className="overflow-y-auto"
                style={{
                  height: `calc(100% - 2.5rem)`,
                  scrollbarWidth: "none",
                }}
              >
                <ul>
                  {bookDonations &&
                    bookDonations.map((donation) => (
                      <li key={donation._id} className="mb-4">
                        <div className="relative border p-4 rounded-md shadow-md bg-blue-50">
                          <div>
                            <p>
                              <strong>Book Description:</strong> {donation.bookDescription}
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
                          </div>
                          {!donation.booked && (
                            <button
                              className="absolute bottom-2 right-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md px-4 py-1"
                              onClick={() => handleBook(donation._id)}
                            >
                              Book
                            </button>
                          )}
                          {donation.booked && (
                            <p className="absolute bottom-2 right-2 text-blue-500">
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

export default NGOBookDonationsDashboard;
