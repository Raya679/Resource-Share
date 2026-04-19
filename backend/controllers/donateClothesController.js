const Clothes = require("../models/donateClothesModel");
const sendEmail = require("../sendEmail");
const Donor = require("../models/donorModel");
const NGO = require("../models/NGOModel");

const getDonatedClothesDonor = async (req, res) => {
  try {
    const donor_id = req.donor._id;
    const clothes = await Clothes.find({ user_id: donor_id }).sort({
      createdAt: -1,
    });
    res.status(200).json(clothes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDonatedClothesNGO = async (req, res) => {
  try {
    const clothes = await Clothes.find({ booked: false }).sort({
      createdAt: -1,
    });
    res.status(200).json(clothes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const donateClothesDonor = async (req, res) => {
  const { clothesDescription, ageGroup, address, contact } = req.body;
  if (!clothesDescription || !ageGroup || !address || !contact) {
    return res.status(400).json({ error: "Please fill in all the fields" });
  }

  try {
    const user_id = req.donor._id;

    const user_rating = req.donor.ratings || [];

    let user_avg_rating = "No rating yet";
    if (user_rating.length > 0)
      user_avg_rating = Math.ceil(req.donor.avg_rating).toString();

    const clothes = await Clothes.create({
      clothesDescription,
      ageGroup,
      address,
      contact,
      user_id,
      user_avg_rating,
    });

    // Updated EMAIL to donor (Donation Received)
    try {
      if (process.env.EMAIL_ENABLED === "true") {
        const donor = await Donor.findById(req.donor._id);
        if (donor && donor.email) {
          sendEmail(
            donor.email,
            "Thank You! Your Clothes Donation Has Been Received ❤️",
            `
            <div style="font-family: Arial; padding: 20px; line-height: 1.6;">
              <h2 style="color: #4CAF50;">Thank You for Your Donation!</h2>

              <p>Hi <strong>${donor.name || "Donor"}</strong>,</p>

              <p>We’ve received your contribution:</p>

              <div style="background: #f6f6f6; padding: 12px; border-radius: 8px;">
                <strong>${clothes.clothesDescription}</strong><br/>
                <small>Age Group: ${clothes.ageGroup}</small>
              </div>

              <p>We’ll notify you when an NGO books it.</p>

              <p style="margin-top: 20px;">Thank you for spreading warmth and kindness. 🌼</p>

              <hr/>
              <p style="font-size: 12px; color: #777;">Resource Share • Making Giving Easier</p>
            </div>
            `
          ).catch((e) => console.error("Email error:", e));
        }
      }
    } catch (e) {
      console.error("Email flow error (nonfatal):", e);
    }

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
      return res.status(404).json({ error: "Clothes not found" });
    }

    if (clothes.booked == true) {
      return res.status(400).json({ error: "Already Booked" });
    }

    clothes.booked = true;
    clothes.ngo_id = req.ngo._id;
    clothes.ngo_email = req.ngo.email;
    const result = await clothes.save();

    try {
      if (process.env.EMAIL_ENABLED === "true") {
        const donor = await Donor.findById(clothes.user_id);
        const ngo = await NGO.findById(req.ngo._id);

        // Email to Donor with NGO Contact
        if (donor && donor.email) {
          sendEmail(
            donor.email,
            "Good News! Your Donation Has Been Booked 🎉",
            `
            <div style="font-family: Arial; padding: 20px; line-height: 1.6;">
              <h2 style="color: #4CAF50;">Your Donation Has Been Booked!</h2>

              <p>Hi <strong>${donor.name || "Donor"}</strong>,</p>

              <p>Your donation has been booked by the following NGO:</p>

              <div style="background:#f6f6f6; padding:12px; border-radius:8px;">
                <strong>${ngo?.name || "NGO"}</strong><br/>
                <strong>Email:</strong> ${ngo?.email || "Not provided"}<br/>
              </div>

              <p><strong>Donation Item:</strong> ${clothes.clothesDescription}</p>

              <p>You may contact them if needed.</p>

              <p style="margin-top:20px;">Thank you for making a difference ❤️</p>

              <hr/>
              <p style="font-size:12px; color:#777;">Resource Share • Connecting Donors & NGOs</p>
            </div>
            `
          ).catch((e) => console.error("Email to donor failed:", e));
        }

        // Email to NGO with Donor Details
        if (ngo && ngo.email) {
          sendEmail(
            ngo.email,
            "You Successfully Booked a Clothes Donation ✔️",
            `
            <div style="font-family: Arial; padding: 20px; line-height: 1.6;">
              <h2 style="color:#4CAF50;">Donation Booked Successfully</h2>

              <p>Hi <strong>${ngo.name || "NGO Team"}</strong>,</p>

              <p>You have booked the following donation:</p>

              <div style="background:#f6f6f6; padding:12px; border-radius:8px;">
                <strong>${clothes.clothesDescription}</strong>
              </div>

              <p>Here are the donor’s details for coordination:</p>

              <div style="background:#eef8ff; padding:12px; border-radius:8px;">
                <strong>Name:</strong> ${donor?.name || "Donor"}<br/>
                <strong>Email:</strong> ${donor?.email || "Not provided"}<br/>
                <strong>Contact:</strong> ${clothes.contact}<br/>
                <strong>Address:</strong> ${clothes.address}
              </div>

              <p>Please contact the donor to arrange pickup or delivery.</p>

              <p style="margin-top:20px;">Thank you for supporting the community 🌍</p>

              <hr/>
              <p style="font-size:12px; color:#777;">Resource Share • Empowering Social Good</p>
            </div>
            `
          ).catch((e) => console.error("Email to NGO failed:", e));
        }
      }
    } catch (e) {
      console.error("Email notify error:", e);
    }

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
      return res.status(404).json({ error: "Clothes not found" });
    }

    res.status(200).json(clothes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBookedClothes = async (req, res) => {
  try {
    const ngo_id = req.ngo._id;
    const bookedClothes = await Clothes.find({ booked: true, ngo_id }).sort({
      createdAt: -1,
    });
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
  getBookedClothes,
};
