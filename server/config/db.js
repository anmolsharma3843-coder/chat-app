import mongoose from 'mongoose'
export  const ConnectDB=async()=>{
   try {
    await mongoose.connect(process.env.MONGO_URL)
     console.log("connected successfully to database")
   } catch (error) {
     console.log(`error occur ${error}`)
    //  process.exit(1)
   }
}