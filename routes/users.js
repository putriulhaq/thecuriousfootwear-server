import express from "express";
const User = express.Router();
import Post from "../models/post.js";
import Users from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

User.put("/like/:postId", authMiddleware, async(req, res) => {
        const id = req.user.userId
        const postId = req.params.postId
    try{
        await Post.findByIdAndUpdate(postId, {
            $addToSet: {like: id},
            $pull: {dislike:id}
        })
        res.status(200).json("The video has been likes")

    } catch(err) {
        return(err)
    }
})

User.put("/dislike/:postId", authMiddleware, async(req, res) => {
    const id = req.user.userId
    const postId = req.params.postId
try{
    await Post.findByIdAndUpdate(postId, {
        $addToSet: {dislike: id},
        $pull: {like:id}
    })
    res.status(200).json("The video has been dislikes")

} catch(err) {
    return(err)
}
})

User.get("/profil/:Id", async (req, res) => {
    const { Id } = req.params;
    const dataProfil = await Users.find({ userId: Id })
    const data = dataProfil.map(data => {
      return {
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        email: data.email,
        phone_number: data.phone_number,
        about: data.about,
        image: data.image
      }
    })
    res.json(data)
  })

User.put("/profil/edit/:id", async (req, res) => {
    const { id } = req.params;
    const myquery = { userId: id };
    const updateData = {
      $set: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        email: req.body.email,
        phone_number: req.body.phone_number,
        about: req.body.about,
        image: req.body.image
      },
    };
    const data = await Users.updateOne(
      myquery,
      updateData,
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      }
    ).clone();
    console.log(data)
    return res.status(200).json(updateData.$set);
  });

export default User;