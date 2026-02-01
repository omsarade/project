const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn ,isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer  = require('multer')
const{storage} = require("../cloudConfig.js")
const upload = multer({ storage });

router 
.route("/")
.get(wrapAsync(listingController.index)) // INDEX
.post(
    isLoggedIn, 
    validateListing, 
    upload.single('listing[image]'), 
    wrapAsync(listingController.createListing)
); //CREATE

// NEW
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync( listingController.showListing)) //Show
.put( isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))// UPDATE
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));// DELETE

// EDIT
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));




module.exports = router;

