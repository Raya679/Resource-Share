import { useEffect } from "react";
import Navbar from "../../components/navbar";
import { useFoodDonationsContext } from "../../hooks/useFoodDonationsContext";
import { useAuthContextNGO } from "../../hooks/useAuthContextNGO";

const NGOBookedFoodDonationsDashboard = () => {
  const { foodDonations, dispatch } = useFoodDonationsContext();
  const { ngo } = useAuthContextNGO();

  // Get food donations
  useEffect(() => {
    const fetchBookedFoodDonations = async () => {
      const response = await fetch("/api/NGO/getBookedFood", {
        headers: { Authorization: `Bearer ${ngo.token}` },
      });
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "SET_FOOD_DONATIONS", payload: json });
      }
    };

    if (ngo) {
      fetchBookedFoodDonations();
    }
  }, [dispatch, ngo]);

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
  );
};

export default NGOBookedFoodDonationsDashboard;