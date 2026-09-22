
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/*
=====================================================
HELPER FUNCTIONS
=====================================================
*/

const normalize = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

/*
=====================================================
HEALTH CHECK
=====================================================
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Ananya Delivery API is running",
  });
});

/*
=====================================================
CHECK DELIVERY
POST /api/check-delivery
=====================================================
*/

app.post("/api/check-delivery", async (req, res) => {
  try {
    const {
      name,
      pincode,
      city,
      state,
      address,
    } = req.body;

    /*
    ================================================
    BASIC VALIDATION
    ================================================
    */

    if (!name || normalize(name).length < 2) {
      return res.status(400).json({
        success: false,
        validAddress: false,
        serviceable: false,
        message: "Please enter your full name.",
      });
    }

    if (!address || normalize(address).length < 5) {
      return res.status(400).json({
        success: false,
        validAddress: false,
        serviceable: false,
        message: "Please enter your complete delivery address.",
      });
    }

    if (!city || normalize(city).length < 2) {
      return res.status(400).json({
        success: false,
        validAddress: false,
        serviceable: false,
        message: "Please enter a valid city.",
      });
    }

    if (!state || normalize(state).length < 2) {
      return res.status(400).json({
        success: false,
        validAddress: false,
        serviceable: false,
        message: "Please enter a valid state.",
      });
    }

    if (!pincode || !/^[1-9][0-9]{5}$/.test(String(pincode))) {
      return res.status(400).json({
        success: false,
        validAddress: false,
        serviceable: false,
        message: "Please enter a valid 6 digit Indian pincode.",
      });
    }

    const pin = String(pincode);

    /*
    ================================================
    PINCODE API
    ================================================
    */

    const apiResponse = await fetch(
      `https://api.postalpincode.in/pincode/${pin}`
    );

    if (!apiResponse.ok) {
      return res.status(503).json({
        success: false,
        validAddress: false,
        serviceable: false,
        message:
          "Pincode verification service is temporarily unavailable. Please try again.",
      });
    }

    const data = await apiResponse.json();

    /*
    ================================================
    INVALID PINCODE
    ================================================
    */

    if (
      !Array.isArray(data) ||
      !data[0] ||
      data[0].Status !== "Success" ||
      !Array.isArray(data[0].PostOffice) ||
      data[0].PostOffice.length === 0
    ) {
      return res.status(200).json({
        success: true,
        validAddress: false,
        serviceable: false,
        message:
          "This pincode does not appear to be a valid Indian delivery pincode.",
        pincode: pin,
      });
    }

    const postOffices = data[0].PostOffice;

    /*
    ================================================
    NORMALIZE USER INPUT
    ================================================
    */

    const normalizedCity = normalize(city);
    const normalizedState = normalize(state);

    /*
    ================================================
    CITY / DISTRICT MATCH
    ================================================
    */

    const cityMatch = postOffices.some((office) => {
      const officeName = normalize(office.Name);
      const district = normalize(office.District);
      const division = normalize(office.Division);
      const region = normalize(office.Region);

      const possibleCities = [
        officeName,
        district,
        division,
        region,
      ].filter(Boolean);

      return possibleCities.some((value) => {
        return (
          value === normalizedCity ||
          value.includes(normalizedCity) ||
          normalizedCity.includes(value)
        );
      });
    });

    /*
    ================================================
    STATE MATCH
    ================================================
    */

    const stateMatch = postOffices.some((office) => {
      const officeState = normalize(office.State);

      return (
        officeState === normalizedState ||
        officeState.includes(normalizedState) ||
        normalizedState.includes(officeState)
      );
    });

    /*
    ================================================
    PINCODE VALID
    BUT CITY / STATE DOES NOT MATCH
    ================================================
    */

    if (!cityMatch || !stateMatch) {
      return res.status(200).json({
        success: true,
        validAddress: false,
        serviceable: false,
        message:
          "Pincode is valid, but the entered city/state does not match this pincode.",
        pincode: pin,
      });
    }

    /*
    ================================================
    DELIVERY AVAILABLE
    ================================================
    */

    return res.status(200).json({
      success: true,

      // IMPORTANT:
      // Frontend isi property ko check karta hai.
      validAddress: true,

      serviceable: true,

      message: "Delivery is available at this address.",

      pincode: pin,

      city: String(city).trim(),

      state: String(state).trim(),

      postOffices: postOffices.map((office) => ({
        name: office.Name || "",
        district: office.District || "",
        state: office.State || "",
        division: office.Division || "",
        region: office.Region || "",
      })),
    });
  } catch (error) {
    console.error("CHECK DELIVERY ERROR:", error);

    return res.status(500).json({
      success: false,
      validAddress: false,
      serviceable: false,
      message:
        "Address verification failed. Please try again.",
    });
  }
});



app.listen(PORT, () => {
  console.log(
    `Ananya Delivery API running on http://localhost:${PORT}`
  );
});
