const Food = require('../models/donateFoodModel');

const getDonatedFoodsDonor = async (req, res) => {
 
  try {
    const donor_id = req.donor._id;
    const food = await Food.find({ user_id: donor_id }).sort({ createdAt: -1 });
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDonatedFoodsNGO = async (req, res) => {
  try {
    const food = await Food.find({booked: false}).sort({ createdAt: -1 });
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const donateFoodDonor = async (req, res) => {
  const { foodItem, quantity, expiry, address, contact } = req.body;
  if (!foodItem || !quantity || !expiry || !address || !contact) {
    return res.status(400).json({ error: 'Please fill in all the fields' });
  }

  try {
    const user_id = req.donor._id;
    const food = await Food.create({ foodItem, quantity, expiry, address, contact, user_id });
    res.status(200).json(food);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const bookDonatedFood = async (req, res) => {
  const { id } = req.params;

  try {
    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }

    if(food.booked==true){
        return res.status(400).json({ error: 'Already Booked' });
    }

    food.booked = true;
    food.ngo_id = req.ngo._id; // Assuming req.ngo contains the logged-in NGO's information
    const result = await food.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteDonatedFood = async (req, res) => {
  const { id } = req.params;

  try {
    const food = await Food.findOneAndDelete({ _id: id });
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }

    res.status(200).json(food);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBookedFood = async (req, res) => {
  try {
    const ngo_id = req.ngo._id; 
    const bookedFood = await Food.find({ booked: true, ngo_id }).sort({ createdAt: -1 });
    res.status(200).json(bookedFood);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDonatedFoodsDonor,
  getDonatedFoodsNGO,
  donateFoodDonor,
  bookDonatedFood,
  deleteDonatedFood,
  getBookedFood
};
