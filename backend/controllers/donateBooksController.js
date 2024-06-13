const Book = require('../models/donateBooksModel');

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
    const book = await Book.find({booked: false}).sort({ createdAt: -1 });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const donateBooksDonor = async (req, res) => {
  const { bookDescription,ageGroup, address, contact } = req.body;
  if (!bookDescription || !ageGroup ||  !address || !contact) {
    return res.status(400).json({ error: 'Please fill in all the fields' });
  }

  try {
    const user_id = req.donor._id;
    const book = await Book.create({ bookDescription,ageGroup,  address, contact, user_id });
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
      return res.status(404).json({ error: 'Books not found' });
    }

    if(book.booked==true){
        return res.status(400).json({ error: 'Already Booked' });
    }

    book.booked = true;
    book.ngo_id = req.ngo._id; // Assuming req.ngo contains the logged-in NGO's information
    const result = await book.save();
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
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBookedBooks = async (req, res) => {
  try {
    const ngo_id = req.ngo._id; 
    const bookedBooks = await Book.find({ booked: true, ngo_id }).sort({ createdAt: -1 });
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
  getBookedBooks
};
