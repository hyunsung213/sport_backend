const { Place } = require("../models");

exports.createPlace = async (req, res) => {
  try {
    const place = await Place.create(req.body);
    res.json(place);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPlaces = async (req, res) => {
  try {
    const places = await Place.findAll();
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPlaceById = async (req, res) => {
  try {
    const place = await Place.findByPk(req.params.id, { include: [Game] });
    if (place) res.json(place);
    else res.status(404).json({ error: "Place not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePlace = async (req, res) => {
  try {
    const [updated] = await Place.update(req.body, {
      where: { placeId: req.params.id },
    });
    if (updated) res.json({ message: "Place updated" });
    else res.status(404).json({ error: "Place not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePlace = async (req, res) => {
  try {
    const deleted = await Place.destroy({
      where: { placeId: req.params.id },
    });
    if (deleted) res.json({ message: "Place deleted" });
    else res.status(404).json({ error: "Place not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
