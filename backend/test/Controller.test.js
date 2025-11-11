const request = require("supertest");
const app = require("../server");

const Food = require("../models/donateFoodModel");
const Book = require("../models/donateBooksModel");
const Clothes = require("../models/donateClothesModel");

jest.mock("../models/donateBooksModel");
jest.mock("../models/donateFoodModel");
jest.mock("../models/donateClothesModel");

describe("Auth APIs", () => {
  it("should login donor successfully with valid credentials", async () => {
    const res = await request(app)
      .post("/api/donor/login")
      .send({ email: "test@gmail.com", password: "Abcd1234#" })
      .expect(200);

    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("email", "test@gmail.com");
  });

  it("should fail donor login with wrong password", async () => {
    const res = await request(app)
      .post("/api/donor/login")
      .send({ email: "test@gmail.com", password: "wrongpass" })
      .expect(400);

    expect(res.body).toHaveProperty("error", "Incorrect password");
  });

  it("should login NGO successfully with valid credentials", async () => {
    const res = await request(app)
      .post("/api/ngo/login")
      .send({ email: "NGO123@gmail.com", password: "Abcd1234#" })
      .expect(200);

    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("email", "NGO123@gmail.com");
  });

  it("should fail NGO login with missing fields", async () => {
    const res = await request(app)
      .post("/api/ngo/login")
      .send({ email: "" })
      .expect(400);

    expect(res.body).toHaveProperty("error", "All fields must be filled");
  });
});


let donorToken, ngoToken;

describe("Donation APIs", () => {

  beforeAll(async () => {
    const donorLoginResponse = await request(app)
      .post("/api/donor/login")
      .send({ email: "test@gmail.com", password: "Abcd1234#" })
      .expect(200);
    donorToken = donorLoginResponse.body.token;
  
    const ngoLoginResponse = await request(app)
      .post("/api/ngo/login")
      .send({ email: "NGO123@gmail.com", password: "Abcd1234#" })
      .expect(200);
    ngoToken = ngoLoginResponse.body.token;
  });

  // Food APIs
  it("should donate food as a donor", async () => {
    const foodData = {
      foodItem: "Pizza",
      quantity: 5,
      expiry: "2024-12-31",
      address: "Test Address",
      contact: "9876543210",
      booked: false,
      user_id: "60c72b2f5f1b2c001f4e0b6b",
    };
    Food.create.mockResolvedValue(foodData);

    const res = await request(app)
      .post("/api/donor/donateFood")
      .send(foodData)
      .set("Authorization", `Bearer ${donorToken}`)
      .expect(200);

    expect(res.body).toEqual(foodData);
  });

  it("should fail to donate food if required fields are missing", async () => {
    const incompleteData = { foodItem: "Pizza" };

    const res = await request(app)
      .post("/api/donor/donateFood")
      .send(incompleteData)
      .set("Authorization", `Bearer ${donorToken}`)
      .expect(400);

    expect(res.body).toEqual({ error: "Please fill in all the fields" });
  });

  it("should book a donated food for an NGO", async () => {
    const mockNgo = { _id: "6732098149087e9a678c671a" };

    const mockFood = {
      _id: "foodId123",
      foodItem: "Rice",
      quantity: "10kg",
      expiry: "2024-12-31",
      address: "123 Main St",
      contact: "1234567890",
      booked: false,
      user_id: "userId123",
      ngo_id: null,
      save: jest.fn().mockResolvedValue({
        _id: "foodId123",
        foodItem: "Rice",
        quantity: "10kg",
        expiry: "2024-12-31",
        address: "123 Main St",
        contact: "1234567890",
        booked: true,
        user_id: "userId123",
        ngo_id: mockNgo._id,
      }),
    };

    Food.findById.mockResolvedValue(mockFood);

    const res = await request(app)
      .put("/api/ngo/bookFood/foodId123")
      .set("Authorization", `Bearer ${ngoToken}`)
      .expect(200);

    expect(res.body).toHaveProperty("booked", true);
    expect(res.body).toHaveProperty("ngo_id", mockNgo._id);

    expect(mockFood.save).toHaveBeenCalled();
  });

  it("should fail to book an already booked food", async () => {
    const mockFood = { _id: "foodId123", booked: true };
    Food.findById.mockResolvedValue(mockFood);

    const res = await request(app)
      .put("/api/ngo/bookFood/foodId123")
      .set("Authorization", `Bearer ${ngoToken}`)
      .expect(400);

    expect(res.body).toEqual({ error: "Already Booked" });
  });

  // Book APIs
  it("should donate book as a donor", async () => {
    const bookData = {
      bookDescription: "Maths Textbook",
      ageGroup: "10-12",
      address: "Test Address",
      contact: "9876543210",
      booked: false,
      user_id: "60c72b2f5f1b2c001f4e0b6b",
    };
    Book.create.mockResolvedValue(bookData);

    const res = await request(app)
      .post("/api/donor/donateBook")
      .send(bookData)
      .set("Authorization", `Bearer ${donorToken}`)
      .expect(200);

    expect(res.body).toEqual(bookData);
  });

  it("should fail to donate book if required fields are missing", async () => {
    const incompleteData = { bookDescription: "Textbook" };

    const res = await request(app)
      .post("/api/donor/donateBook")
      .send(incompleteData)
      .set("Authorization", `Bearer ${donorToken}`)
      .expect(400);

    expect(res.body).toEqual({ error: "Please fill in all the fields" });
  });

  it("should book a donated book for an NGO", async () => {
    const mockNgo = { _id: "6732098149087e9a678c671a" };

    const mockBook = {
      _id: "bookId123",
      bookDescription: "Maths Textbook",
      ageGroup: "10-12",
      address: "123 Main St",
      contact: "1234567890",
      booked: false,
      user_id: "userId123",
      ngo_id: null,
      save: jest.fn().mockResolvedValue({
        _id: "bookId123",
        bookDescription: "Maths Textbook",
        ageGroup: "10-12",
        address: "123 Main St",
        contact: "1234567890",
        booked: true,
        user_id: "userId123",
        ngo_id: mockNgo._id,
      }),
    };

    Book.findById.mockResolvedValue(mockBook);

    const res = await request(app)
      .put("/api/ngo/bookBooks/bookId123")
      .set("Authorization", `Bearer ${ngoToken}`)
      .expect(200);

    expect(res.body).toHaveProperty("booked", true);
    expect(res.body).toHaveProperty("ngo_id", mockNgo._id);

    expect(mockBook.save).toHaveBeenCalled();
  });

  it("should fail to book an already booked book", async () => {
    const mockBook = { _id: "bookId123", booked: true };
    Book.findById.mockResolvedValue(mockBook);

    const res = await request(app)
      .put("/api/ngo/bookBooks/bookId123")
      .set("Authorization", `Bearer ${ngoToken}`)
      .expect(400);

    expect(res.body).toEqual({ error: "Already Booked" });
  });

  // Clothes APIs
  it("should donate clothes as a donor", async () => {
    const clothesData = {
      clothesDescription: "20 T-shirts",
      ageGroup: "10-12",
      address: "Test Address",
      contact: "9876543210",
      booked: false,
      user_id: "60c72b2f5f1b2c001f4e0b6b",
    };
    Clothes.create.mockResolvedValue(clothesData);

    const res = await request(app)
      .post("/api/donor/donateClothes")
      .send(clothesData)
      .set("Authorization", `Bearer ${donorToken}`)
      .expect(200);

    expect(res.body).toEqual(clothesData);
  });

  it("should fail to donate clothes if required fields are missing", async () => {
    const incompleteData = { clothesDescription: "Textbook" };

    const res = await request(app)
      .post("/api/donor/donateClothes")
      .send(incompleteData)
      .set("Authorization", `Bearer ${donorToken}`)
      .expect(400);

    expect(res.body).toEqual({ error: "Please fill in all the fields" });
  });

  it("should book a donated clothes for an NGO", async () => {
    const mockNgo = { _id: "6732098149087e9a678c671a" };

    const mockClothes = {
      _id: "clothesId123",
      clothesDescription: "20 T-shirts",
      ageGroup: "10-12",
      address: "123 Main St",
      contact: "1234567890",
      booked: false,
      user_id: "userId123",
      ngo_id: null,
      save: jest.fn().mockResolvedValue({
        _id: "clothesId123",
        clothesDescription: "20 T-shirts",
        ageGroup: "10-12",
        address: "123 Main St",
        contact: "1234567890",
        booked: true,
        user_id: "userId123",
        ngo_id: mockNgo._id,
      }),
    };

    Clothes.findById.mockResolvedValue(mockClothes);

    const res = await request(app)
      .put("/api/ngo/bookClothes/clothesId123")
      .set("Authorization", `Bearer ${ngoToken}`)
      .expect(200);

    expect(res.body).toHaveProperty("booked", true);
    expect(res.body).toHaveProperty("ngo_id", mockNgo._id);

    expect(mockClothes.save).toHaveBeenCalled();
  });

  it("should fail to clothes an already booked clothes", async () => {
    const mockClothes = { _id: "clothesId123", booked: true };
    Clothes.findById.mockResolvedValue(mockClothes);

    const res = await request(app)
      .put("/api/ngo/bookClothes/clothesId123")
      .set("Authorization", `Bearer ${ngoToken}`)
      .expect(400);

    expect(res.body).toEqual({ error: "Already Booked" });
  });

  // Rating 
  it("should allow an NGO to rate a donor successfully", async () => {
    const ratingData = {
      donorId: "673393fd524f93b3a1a6bace",
      rating: 4,
    };

    const response = await request(app)
      .post("/api/donor/rateDonor")
      .set("Authorization", `Bearer ${ngoToken}`)
      .send(ratingData)
      .expect(200);

    expect(response.body).toHaveProperty(
      "message",
      "Rating added successfully"
    );
    expect(response.body).toHaveProperty("donor");
    expect(response.body.donor).toHaveProperty("avg_rating");
    expect(response.body.donor).toHaveProperty("email");
    expect(response.body.donor).toHaveProperty("ratings");
  });

  it('should return an error if rating is invalid', async () => {
    const invalidRatingData = {
      donorId: "donorId123", 
      rating: 6,             
    };

    const response = await request(app)
      .post("/api/donor/rateDonor")
      .set("Authorization", `Bearer ${ngoToken}`)
      .send(invalidRatingData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Rating must be between 1 and 5');
  });

  it('should return an error if unauthorized access is attempted', async () => {
    const ratingData = {
      donorId: "donorId123",
      rating: 4,
    };

    const response = await request(app)
      .post("/api/donor/rateDonor")
      .send(ratingData) 
      .expect(401);

    expect(response.body).toHaveProperty('error', 'NGO Authorization token required');
  });
});