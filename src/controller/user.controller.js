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
        let result = await userModel.updateOne(
          { $push: {first_name, last_name, email, gender, password } } 
        )
        await newUser.save()
        res.redirect('/')
      } catch (error) {
        console.error(error)
        res.status(500).send('Hubo un error al crear el usuario');
      }
    res.send({ status: "success", message: "Usuario creado" }).redirect('/login')
}


export const getUser = async (req, email) => {
  try {
    let user = await userModel.findOne({ email: email }, { __v: 0 }).lean()
    if (!user) throw new Error(`User not exists.`)
    return user
    //res.json(user);
  } catch (error) {
    //return res.status(400).json({ error: error.message });
  }
}
