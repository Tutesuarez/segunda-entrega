// export const testLogin=(req, res, next)=>{
//     const { email, password}= req.body

//     try {
//         if (!req.user) {
//             return res.status(401).send({ status: "error", error: "Usuario invalido" })
//         }
//         //Genero la sesion de mi usuario
//         req.session.user = {
//             email: req.user.email,
//             first_name: req.user.first_name
//         }

//         res.status(200).send({ status: "success", payload: req.user })

//     } catch (error) {
//         res.status(500).send({ status: "Error", error: error.message })
//     }
// }

export const destroySession=(req, res, next)=>{
    if (req.session.login) {
        req.session.destroy(()=>{
            res.status(200).json({message: 'session destroyed'})
        })
    }
}

export const getSession=(req, res, next)=>{
    if (req.session.login) {
        res.status(200).json({message: ' Active session'})
    }else{
        res.status(401).json({message: ' Active session'})
    }
}