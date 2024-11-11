import { useState, useEffect, useRef } from "react";
import Navbar from "../../components/navbar";
import { useBookDonationsContext } from "../../hooks/useBookDonationsContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const DonorBookDonationsDashboard = () => {
  const { bookDonations, dispatch } = useBookDonationsContext();
  const { donor } = useAuthContext();
  const formRef = useRef(null);
  const [formHeight, setFormHeight] = useState(0);

  useEffect(() => {
    if (formRef.current) {
      setFormHeight(formRef.current.clientHeight);
    }
  }, []);

  // Fetch book donations
  useEffect(() => {
    const fetchBookDonations = async () => {
      const response = await fetch("/api/donor/getBook", {
        headers: { Authorization: `Bearer ${donor.token}` },
      });
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "SET_BOOK_DONATIONS", payload: json });
        console.log(json);
      }
    };

    if (donor) {
      fetchBookDonations();
    }
  }, [dispatch, donor]);

  // Delete book donation
  const handleDelete = async (id) => {
    console.log(id)
    if (!donor) {
      setError("You must be logged in");
      return;
    }

    const response = await fetch(`/api/donor/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${donor.token}`,
      },
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_BOOK_DONATIONS", payload: json });
    } else {
      console.log("Error deleting food:", response.statusText);
    }
  };


  // Create book donation
  const [bookDescription, setBookDescription] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!donor) {
      setError("You must be logged in");
      return;
    }

    const bookDonation = { bookDescription, ageGroup, address, contact };

    const response = await fetch("/api/donor/donateBook", {
      method: "POST",
      body: JSON.stringify(bookDonation),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${donor.token}`,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }

    if (response.ok) {
      setBookDescription("");
      setAgeGroup("");
      setAddress("");
      setContact("");
      setError(null);
      dispatch({ type: "CREATE_BOOK_DONATIONS", payload: json });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <Navbar />
      <div className="flex flex-grow items-center justify-center">
        <div className="container mx-auto p-8">
          <h1 className="text-3xl font-bold text-center text-blue-500 mb-8">
            My Book Donations
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Donations Card */}
            <div
              className="p-6 bg-white border border-blue-400 rounded-lg shadow-lg"
              style={{ height: `${formHeight}px` }}
            >
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
                              <strong>Description:</strong> {donation.bookDescription}
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
                          <button
                            className="absolute top-2 right-2 text-red-500"
                            onClick={() => handleDelete(donation._id)}
                          >
                            &#x2715;
                          </button>
                          {donation.booked && (
                            <div className="absolute bottom-2 right-2 bg-blue-400 text-white px-2 py-1 rounded">
                              Booked!!
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* New Donation Form */}
            <div
              className="p-6 bg-white border border-blue-400 rounded-lg shadow-lg"
              ref={formRef}
            >
              <h2 className="text-2xl font-bold text-blue-600 mb-4">
                Make New Book Donation
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="mb-4">
                  <label className="block text-gray-700">Description</label>
                  <input
                    type="text"
                    name="bookDescription"
                    value={bookDescription}
                    onChange={(e) => setBookDescription(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Age Group</label>
                  <input
                    type="text"
                    name="ageGroup"
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Contact</label>
                  <input
                    type="tel"
                    name="contact"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                >
                  Submit Book Donation
                </button>
                {error && <div className="mt-4 text-red-500">{error}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorBookDonationsDashboard;
