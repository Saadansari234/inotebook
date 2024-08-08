const mongoose= require("mongoose")

const mongoURL="mongodb://localhost:27017/inotebook?directConnection=true"

const  ConnectToMongo= async()=>{
    try {
        await mongoose.connect(mongoURL);
        console.log('Database connection successful');
      } catch (error) {
        console.error('Database connection error:', error);
      }
}

module.exports =  ConnectToMongo