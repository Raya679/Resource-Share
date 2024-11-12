import { useState, useEffect, useRef } from "react";
import Navbar from "../../components/navbar";
import { useFoodDonationsContext } from "../../hooks/useFoodDonationsContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const DonorFoodDonationsDashboard = () => {
  const { foodDonations, dispatch } = useFoodDonationsContext();
  const { donor } = useAuthContext();
  const formRef = useRef(null);
  const [formHeight, setFormHeight] = useState(0);

  useEffect(() => {
    if (formRef.current) {
      setFormHeight(formRef.current.clientHeight);
    }
  }, []);

  // Get food donations
  useEffect(() => {
    const fetchFoodDonations = async () => {
      const response = await fetch("/api/donor/getFood", {
        headers: { Authorization: `Bearer ${donor.token}` },
      });
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "SET_FOOD_DONATIONS", payload: json });
        console.log(json);
      }
    };

    if (donor) {
      fetchFoodDonations();
    }
  }, [dispatch, donor]);

  // Delete food donation
  const handleDelete = async (id) => {
    console.log(id);
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
      dispatch({ type: "DELETE_FOOD_DONATIONS", payload: json });
    } else {
      console.log("Error deleting food:", response.statusText);
    }
  };

  // Create food donations
  const [foodItem, setFoodItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiry, setExpiry] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!donor) {
      setError("You must be logged in");
      return;
    }

    const foodDonation = { foodItem, quantity, expiry, address, contact };

    const response = await fetch("/api/donor/donateFood", {
      method: "POST",
      body: JSON.stringify(foodDonation),
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
      setFoodItem("");
      setQuantity("");
      setExpiry("");
      setAddress("");
      setContact("");
      setError(null);
      dispatch({ type: "CREATE_FOOD_DONATIONS", payload: json });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      <Navbar />
      <div className="flex flex-grow items-center justify-center">
        <div className="container mx-auto p-8">
          <h1 className="text-3xl font-bold text-center text-teal-500 mb-8">
            My Food Donations
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Donations Card */}
            <div
              className="p-6 bg-white border border-green-400 rounded-lg shadow-lg"
              style={{ height: `${formHeight}px` }}
            >
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
                          <button
                            className="absolute top-2 right-2 text-red-500"
                            onClick={() => handleDelete(donation._id)}
                          >
                            &#x2715;
                          </button>
                          {donation.booked && (
                            <div className="absolute bottom-2 right-2 bg-blue-400 text-white px-2 py-1 rounded">
                              <span>Booked!!</span>
                            </div>
                          )}
                          {donation.ngo_email && donation.booked && (
                            <div className="mt-1 text-s">
                              Booked by{" "}
                              <a
                                href={`mailto:${donation.ngo_email}`}
                                className="text-blue-700 hover:text-blue-900"
                              >
                                {donation.ngo_email}
                              </a>
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
              className="p-6 bg-white border border-green-400 rounded-lg shadow-lg"
              ref={formRef}
            >
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                Make New Food Donation
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="mb-4">
                  <label className="block text-gray-700">Food Item</label>
                  <input
                    type="text"
                    name="foodItem"
                    value={foodItem}
                    onChange={(e) => setFoodItem(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Quantity</label>
                  <input
                    type="text"
                    name="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Expiry Date</label>
                  <input
                    type="text"
                    name="expiry"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
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
                  className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition duration-300"
                >
                  Submit Food Donation
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

export default DonorFoodDonationsDashboard;
