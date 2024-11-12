const Clothes = require('../models/donateClothesModel');

const getDonatedClothesDonor = async (req, res) => {
 
  try {
    const donor_id = req.donor._id;
    const clothes = await Clothes.find({ user_id: donor_id }).sort({ createdAt: -1 });
    res.status(200).json(clothes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDonatedClothesNGO = async (req, res) => {
  try {
    const clothes = await Clothes.find({booked: false}).sort({ createdAt: -1 });
    res.status(200).json(clothes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const donateClothesDonor = async (req, res) => {
  const { clothesDescription,ageGroup, address, contact } = req.body;
  if (!clothesDescription || !ageGroup ||  !address || !contact) {
    return res.status(400).json({ error: 'Please fill in all the fields' });
  }

  try {
    const user_id = req.donor._id;

    const user_rating = req.donor.ratings || []; 

    let user_avg_rating = "No rating yet"
    if(user_rating.length>0) user_avg_rating = (Math.ceil(req.donor.avg_rating)).toString()

    const clothes = await Clothes.create({ clothesDescription,ageGroup,  address, contact, user_id, user_avg_rating });
    res.status(200).json(clothes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const bookDonatedClothes = async (req, res) => {
  const { id } = req.params;

  try {
    const clothes = await Clothes.findById(id);
    if (!clothes) {
      return res.status(404).json({ error: 'Clothes not found' });
    }

    if(clothes.booked==true){
        return res.status(400).json({ error: 'Already Booked' });
    }

    clothes.booked = true;
    clothes.ngo_id = req.ngo._id; 
    const result = await clothes.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteDonatedClothes = async (req, res) => {
  const { id } = req.params;

  try {
    const clothes = await Clothes.findOneAndDelete({ _id: id });
    if (!clothes) {
      return res.status(404).json({ error: 'Clothes not found' });
    }

    res.status(200).json(clothes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBookedClothes = async (req, res) => {
  try {
    const ngo_id = req.ngo._id; 
    const bookedClothes = await Clothes.find({ booked: true, ngo_id }).sort({ createdAt: -1 });
    res.status(200).json(bookedClothes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDonatedClothesDonor,
  getDonatedClothesNGO,
  donateClothesDonor,
  bookDonatedClothes,
  deleteDonatedClothes,
  getBookedClothes
};
