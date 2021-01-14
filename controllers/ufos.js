const mongoose = require("mongoose");

//use createConnection so i can connect to 2 databases (one user, one dataset)
const conn1=mongoose.createConnection(process.env.DATABASE1, { useNewUrlParser: true });

const Ufos=conn1.model('sightings',require("../models/UFOS"));

exports.findAll = async (req, res) => {
  try {
    const ufos = await Ufos.find({});
    res.render("ufos", { ufos: ufos });
  } catch (e) {
    res.status(404).send({ message: "could not get UFOs" });
  }
};

exports.find = async (req, res) => {
  try {
    //gets params from url
    const lat = req.params.lat;
    const long = req.params.long;
    const year = req.params.year;
    //1. query filters db by year, year handeled as sting not datetime due to db formating
    //2. absolute distance between long lat of user point and db point and adds the two values to get aproximate distance
    //3. limits returned documents to 20 for use in map (5 for testing)
    const ufos = await Ufos.aggregate([{$match:{datetime:{$regex : `.*${year}.*`}}},{$addFields: {distance: {$sum: [{$abs: {$subtract: [{$sum:["$longitude",0]},Number(long)]}}, {$abs: {$subtract: [{$sum:["$latitude",0]},Number(lat)]}}]}}},{$sort:{distance:1}},{$limit:5}]);
    //needs JSON.stringingify of [object Object] error
    res.render("new-map", { data: JSON.stringify(ufos), lat:lat, long:long });
    console.log('UFO specific search mode ran no problems')
  } catch (e) {
    //runs on error so 0 result objects handeled up the stack, logs error to console and message to user
    console.log(e)
    res.status(404).send({ message: "could not get UFOs, specific search mode" });
  }
};