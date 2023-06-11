import { userModel } from "./models/user.model.js"

export const createUser = async (req, res) => {
    try {
        const newUser = new userModel({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          gender: req.body.gender,
          password: req.body.password,
        });
        result = await userModel.updateOne(
          { $push: {first_name, last_name, email, gender, password } } 
        )
        //await newUser.save();
        res.redirect('/');
      } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error al crear el usuario');
      }
  //  res.send({ status: "success", message: "Usuario creado" })
}
