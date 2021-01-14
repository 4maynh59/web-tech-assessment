const mongoose = require("mongoose");

//use createConnection so i can connect to 2 databases (one user, one dataset)
const conn2=mongoose.createConnection(process.env.DATABASE2, { useNewUrlParser: true });

const UserUfos=conn2.model('sightings',require("../models/UFOS"));

const conn3=mongoose.createConnection(process.env.DATABASE2, { useNewUrlParser: true });

exports.findall = async (req, res) => {
  try {
    const ufos = await UserUfos.find({});
    res.render("user-ufos", { data: JSON.stringify(ufos) });
  } catch (e) {
    res.status(404).send({ message: "could not get user UFOs" });
  }
}

exports.delete = async (req, res) => {
  try {
    const deleteId=req.params.id;
    const ufos = await UserUfos.deleteOne({"_id": deleteId});
    res.render("index");
  } catch (e) {
    console.log(e)
    res.status(404).send({ message: "could not delete get user UFOs" });
  }
}

exports.create = async (req, res) => {
  try {
    const datetime=req.params.datetime;
    const city=req.params.city;
    const state=req.params.state;
    const country=req.params.country;
    const shape=req.params.shape;
    const durationhoursmin=req.params.durationhoursmin;
    const comments=req.params.comments;
    const lat=Number(req.params.latitude);
    const long=Number(req.params.longitude);
    const today= new Date();
    const datePosted=`${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;
    const durationhours=`${Math.floor(durationhoursmin)} hours ${60*(durationhoursmin-Math.floor(durationhoursmin))} minuets`;
    const durationseconds=req.params.durationhoursmin*3600;
    //db.sightings.insert({"datetime" : datetime, "city" : city, "state" : state, "country" : country, "shape" : shape, "duration (seconds)" : durationseconds, "duration (hours/min)" : durationhours, "comments" : comments, "date posted" : datePosted, "latitude" : lat, "longitude" : long })
    //await UserUfos.create({"datetime" : datetime, "city" : city, "state" : state, "country" : country, "shape" : shape, "duration (seconds)" : durationseconds, "duration (hours/min)" : durationhours, "comments" : comments, "date posted" : datePosted, "latitude" : lat, "longitude" : long });

    const schema = mongoose.Schema(
      {
        datetime: String,
        city: String,
        state: String,
        country: String,
        shape: String,
        durationseconds: String,
        durationhoursmin: String,
        comments: String,
        dateposted: String,
        latitude: Number,
        longitude: Number,
      },
      { timestamps: true }
    );


    const ufoModel=conn3.model('model',schema,'sightings');
    const data= new ufoModel({datetime : datetime, city : city, state : state, country : country, shape : shape, durationseconds : durationseconds, durationhoursmin : durationhours, comments : comments, dateposted : datePosted, latitude : lat, longitude : long });

    console.log({datetime : datetime, city : city, state : state, country : country, shape : shape, durationseconds : durationseconds, durationhoursmin : durationhours, comments : comments, dateposted : datePosted, latitude : lat, longitude : long });

    const ufo=await data.save();
    res.render("index");
  } catch (e) {
    console.log(e)
    res.status(404).send({ message: "could not create user UFOs" });
  }
}

exports.update = async (req, res) => {
  try {
    console.log('ran updater')
    const datetime=req.params.datetime;
    const city=req.params.city;
    const state=req.params.state;
    const country=req.params.country;
    const shape=req.params.shape;
    const durationhoursmin=req.params.durationhoursmin;
    const comments=req.params.comments;
    const lat=req.params.latitude;
    const long=req.params.longitude;
    const id=req.params.id;
    const today= new Date();
    const datePosted=`${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;
    const durationseconds=req.params.durationhoursmin*3600;
    console.log(id);
    //dateposted:datePosted, durationhoursmin:durationhours
    const ufos=await UserUfos.updateOne({_id:{$eq:id}},[{$set:{datetime:datetime, comments:comments, city:city, latitude:lat, longitude: long, shape:shape, state:state, country:country, dateposted:datePosted, durationhoursmin: durationhoursmin, durationseconds:durationseconds}}]);
    console.log(ufos)
    res.render("index");
  } catch (e) {
    console.log(e)
    res.status(404).send({ message: "could not update user UFOs" });
  }
}

exports.findOne = async (req, res) => {
  try{
    const id=req.params.id;
    const ufos = await UserUfos.findOne({"_id": id});
    res.render("ufo-update", { data: JSON.stringify(ufos) });
  } catch(e){
    console.log(e)
    res.status(404).send({ message: "could not find user UFOs" });
  }

}