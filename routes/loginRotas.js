const express = require('express')
const router = express.Router()
const BD = require('../db')

router.get('/login', (req, res) => {
    res.render('admin/login')
})

router.post('/login', async(req, res) =>{
    const usuario = req.body.usuario
    const senha = req.body.senha

    const buscadados = await BD.query(`
        select * from usuarios where usuario = $1 and senha = $2
         `, [usuario, senha])
    
        if (buscadados.rows.length > 0) {
            req.session.usuarioLogado = buscadados.rows[0].usuario
            req.session.nomeUsuario = buscadados.rows[0].nome
            req.session.idUsuario = buscadados.rows[0].id_usuario
            res.redirect('/admin/')
        } else{
            res.render('admin/login', {mensagem: 'Usuario ou senha errado'})
        }
})



module.exports = router
