const express = require('express')
const router = express.Router()
const BD = require('../db')

router.get('/novo', (req,res)=>{
    res.render('categoriasTelas/criar')
})




router.get('/', async (req, res)=> {


const busca = req.query.busca || ''
        const ordenar = req.query.ordenar || 'nome_categoria'
        
    const buscaDados= await BD.query(`SELECT * FROM categorias where upper(nome_categoria) like $1 order by ${ordenar}`, [`%${busca.toUpperCase()}%`]);

    res.render('categoriasTelas/lista', {categorias: buscaDados.rows, busca: busca, ordenar: ordenar})
})




router.post('/novo', async(req, res) =>  {
    const{nome_categoria} = req.body

    await BD.query('insert into categorias (nome_categoria) values ($1)', [nome_categoria])

    res.redirect('/categorias')
})

router.post('/:id/deletar', async(req, res) => {
    const {id} = req.params
    await BD.query('delete from categorias where id_categoria = $1', [id])   
    res.redirect('/categorias')
})

router.get('/:id/editar', async(req, res) => {
    const {id} = req.params
    const resultado = await BD.query('select * from categorias where id_categoria = $1', [id])   
    res.render('categoriasTelas/editar', {categoria: resultado.rows[0]})
})


router.post('/:id/editar', async(req, res) =>{
    const{id} = req.params
    const {nome_categoria} = req.body
    await BD.query('update categorias set nome_categoria = $1 where id_categoria = $2', [nome_categoria, id])
    res.redirect('/categorias')
})


module.exports = router