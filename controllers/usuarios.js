import { generarToken } from "../helpers/autenticacion.js";
import usuariosModel from "../models/usuarios.js";
import bcrypt from "bcrypt";

class usuariosController {
  constructor() {}

  async register(req, res) {
    try {
      const { email, nombre, telefono, clave } = req.body;
      const usuarioExistente = await usuariosModel.getOne({ email });

      if (usuarioExistente) {
        return res.status(400).json({ error: "El usuario ya existe" });
      }

      const claveEncriptada = await bcrypt.hash(clave, 10);

      const data = await usuariosModel.create({
        email,
        nombre,
        telefono,
        clave: claveEncriptada,
      });

      res.status(201).json(data);
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  }

  async login(req, res) {
    const { email, clave } = req.body;

    const usuarioExistente = await usuariosModel.getOne({ email });

    if (!usuarioExistente) {
      return res.status(400).json({ error: "El usuario no existe" });
    }

    const claveValida = await bcrypt.compare(clave, usuarioExistente.clave);

    if (!claveValida) {
      return res.status(400).json({ error: "Clave no valida" });
    }

    const token = generarToken(email);

    res.status(200).json({ msg: "Usuario autenticado", token });
  }
}

export default new usuariosController();
