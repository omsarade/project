const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  let { search, category } = req.query;
  let query = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }
  if (category && category !== "undefined") {
    query.category = category;
  }
  const allListings = await Listing.find(query);
  res.render("listings/index.ejs", { allListings, search, category });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = (async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate({
    path: "reviews",
    populate: {
      path: "author",
    },
  })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requsted for does not exist!")
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
});

module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing you requsted for does not exist!")
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  req.flash("success", "Listing was Edited!");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(req.params.id);

  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  listing.title = req.body.listing.title;
  listing.description = req.body.listing.description;
  listing.price = req.body.listing.price;
  listing.location = req.body.listing.location;
  listing.country = req.body.listing.country;
  await listing.save();

  req.flash("success", "Listing was Updated!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};