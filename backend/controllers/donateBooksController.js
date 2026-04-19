const Book = require("../models/donateBooksModel");
const sendEmail = require("../sendEmail");
const Donor = require("../models/donorModel");
const NGO = require("../models/NGOModel");

const getDonatedBooksDonor = async (req, res) => {
  try {
    const donor_id = req.donor._id;
    const book = await Book.find({ user_id: donor_id }).sort({ createdAt: -1 });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDonatedBooksNGO = async (req, res) => {
  try {
    const book = await Book.find({ booked: false }).sort({ createdAt: -1 });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const donateBooksDonor = async (req, res) => {
  const { bookDescription, ageGroup, address, contact } = req.body;
  if (!bookDescription || !ageGroup || !address || !contact) {
    return res.status(400).json({ error: "Please fill in all the fields" });
  }

  try {
    const user_id = req.donor._1d || req.donor._id; // fallback if mis-typed elsewhere
    const user_rating = req.donor.ratings || [];

    let user_avg_rating = "No rating yet";
    if (user_rating.length > 0)
      user_avg_rating = Math.ceil(req.donor.avg_rating).toString();

    const book = await Book.create({
      bookDescription,
      ageGroup,
      address,
      contact,
      user_id: req.donor._id,
      user_avg_rating,
    });

    // Updated EMAIL to donor (Donation Received)
    try {
      if (process.env.EMAIL_ENABLED === "true") {
        const donor = await Donor.findById(req.donor._id);
        if (donor && donor.email) {
          sendEmail(
            donor.email,
            "Thank You! Your Book Donation Has Been Received ❤️",
            `
            <div style="font-family: Arial; padding: 20px; line-height: 1.6;">
              <h2 style="color: #4CAF50;">Thank You for Your Donation!</h2>

              <p>Hi <strong>${donor.name || "Donor"}</strong>,</p>

              <p>We’ve received your contribution:</p>

              <div style="background: #f6f6f6; padding: 12px; border-radius: 8px;">
                <strong>${book.bookDescription}</strong><br/>
                <small>Age Group: ${book.ageGroup}</small>
              </div>

              <p>We’ll notify you when an NGO books it.</p>

              <p style="margin-top: 20px;">Thank you for spreading knowledge and kindness. 📚</p>

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

    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const bookDonatedBooks = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ error: "Books not found" });
    }

    if (book.booked === true) {
      return res.status(400).json({ error: "Already Booked" });
    }

    book.booked = true;
    book.ngo_id = req.ngo._id;
    book.ngo_email = req.ngo.email;
    const result = await book.save();

    try {
      if (process.env.EMAIL_ENABLED === "true") {
        const donor = await Donor.findById(book.user_id);
        const ngo = await NGO.findById(req.ngo._id);

        // Email donor with NGO contact
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

              <p><strong>Donation Item:</strong> ${book.bookDescription}</p>

              <p>You may contact them if needed.</p>

              <p style="margin-top:20px;">Thank you for making a difference ❤️</p>

              <hr/>
              <p style="font-size:12px; color:#777;">Resource Share • Connecting Donors & NGOs</p>
            </div>
            `
          ).catch((e) => console.error("Email to donor failed:", e));
        }

        // Email NGO with donor details
        if (ngo && ngo.email) {
          sendEmail(
            ngo.email,
            "You Successfully Booked a Book Donation ✔️",
            `
            <div style="font-family: Arial; padding: 20px; line-height: 1.6;">
              <h2 style="color:#4CAF50;">Donation Booked Successfully</h2>

              <p>Hi <strong>${ngo.name || "NGO Team"}</strong>,</p>

              <p>You have booked the following donation:</p>

              <div style="background:#f6f6f6; padding:12px; border-radius:8px;">
                <strong>${book.bookDescription}</strong>
              </div>

              <p>Here are the donor’s details for coordination:</p>

              <div style="background:#eef8ff; padding:12px; border-radius:8px;">
                <strong>Name:</strong> ${donor?.name || "Donor"}<br/>
                <strong>Email:</strong> ${donor?.email || "Not provided"}<br/>
                <strong>Contact:</strong> ${book.contact}<br/>
                <strong>Address:</strong> ${book.address}
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

const deleteDonatedBooks = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findOneAndDelete({ _id: id });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBookedBooks = async (req, res) => {
  try {
    const bookedBooks = await Book.find({
      booked: true,
      ngo_id: req.ngo._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(bookedBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDonatedBooksDonor,
  getDonatedBooksNGO,
  donateBooksDonor,
  bookDonatedBooks,
  deleteDonatedBooks,
  getBookedBooks,
};
