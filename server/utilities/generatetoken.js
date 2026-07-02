import jwt from 'jsonwebtoken'

const generatetoken=(user, res)=>{
   const token=jwt.sign(
    {
        _id:user._id,
        username:user.username,
        email:user.email,
        profileImage:user.profileImage
    },
    process.env.JWT_SECRET,
    {
        expiresIn:process.env.JWT_EXPIRES
    }
   );
   res.cookie('token',token,{
    httpOnly: true,
    sameSite: "None",   
    secure: true,
    maxAge: 5 * 24 * 60 * 60 * 1000, 
   })

   return token;
}
export {generatetoken}
