const express = require('express')
const router = express.Router()
const BD = require('../db')

//listar usúarios
router.get("/", async (req, res) => {
    const buscaDados =  await BD.query('SELECT * FROM usuarios')
    console.log(buscaDados.rows);
    
    res.render('usuariosTelas/lista', { vetorDados: buscaDados.rows})
   })
   
   router.get("/novo", (req, res) => {
       res.render("usuariosTelas/criar",)
   })
   
   router.post("/novo", async (req, res) => {
       const { nome, usuario, senha  } = req.body
       await BD.query("insert into usuarios (nome, usuario, senha) values($1, $2, $3)", [nome, usuario, senha])
       res.redirect("/usuarios")
   })
   
   router.post("/:id/deletar", async (req, res) => {
       const { id } = req.params
       await BD.query("delete from usuarios where id_usuario= $1", [id])
       res.redirect("/usuarios")
   
   })
   
   router.get('/:id/editar', async (req, res) => {
       const { id } = req.params
       const resultado = await BD.query("select * from usuarios where id_usuario = $1", [id])
       res.render("usuariosTelas/editar", { usuario: resultado.rows[0] })
   })
   router.post("/:id/editar", async (req, res) => {
       const { id } = req.params
       const { nome, usuario, senha} = req.body
       await BD.query("update usuarios set nome = $1, usuario = $2, senha = $3 where id_usuario = $4", [nome, usuario, senha, id])
       res.redirect("/usuarios")
   
   })






module.exports = router