const express = require('express')
const router = express.Router()
const BD = require('../db')

router.get('/', async (req, res) => {
    const qaprodutos = await BD.query(`select count(*) as total_produtos from produtos`)

    const qacategoria = await BD.query(`select count(*) as total_categorias from categorias`)

    const valortotal = await BD.query(`select sum (valor * estoque) as valor_total from produtos`)

    const grafico = await BD.query(`select sum(p.estoque) as estoque, c.nome_categoria 
        from categorias as c 
            inner join produtos as p on c.id_categoria = p.id_categoria
        group by c.nome_categoria`)


        const listaProdutosEstoqueMinimo = await BD.query(`select * from produtos where estoque < estoque_minimo`)

        const estoque_acima = await BD.query(`select nome_produto, estoque from produtos as p where estoque > estoque_minimo`)

        const estoque_abaixo = await BD.query(`select nome_produto, estoque, estoque_minimo,imagem from produtos as p where estoque < estoque_minimo`)
        const abaixo = await BD.query(`select count(*) as produto_min from produtos where estoque < estoque_minimo`)


    res.render("admin/dashboard", {
        totalprodutos: qaprodutos.rows[0].total_produtos,
        totalcategorias: qacategoria.rows[0].total_categorias,
        vatotal: valortotal.rows[0].valor_total,
        categorias_estoques: grafico.rows, 
        produtosEstoqueMinimo : listaProdutosEstoqueMinimo.rows,
        max_estoque: estoque_acima.rows,
        abaixo_estoque: estoque_abaixo.rows,
        abaixo:abaixo.rows[0].produto_min

    })

})






module.exports = router