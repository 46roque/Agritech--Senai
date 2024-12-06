const express = require('express')
const router = express.Router()
const BD = require('../db')

router.get('/', async (req, res) => {
    try {

        const busca = req.query.busca || ''
        const ordenar = req.query.ordenar || 'nome_produto'

        const buscadados = await BD.query(`
          select r.id_produto, r.nome_produto, r.estoque, r.estoque_minimo, r.valor, r.imagem,
            c.id_categoria, c.nome_categoria
            from produtos as r left join categorias as c on r.id_categoria = c.id_categoria
            where r.nome_produto like $1 or c.nome_categoria like $1
            order by ${ordenar} `, [`%${busca}%`])

        res.render("produtosTelas/lista", {
            vetorDados: buscadados.rows,
            busca: busca,
            ordenar: ordenar
        })

    } catch (erro) {
        console.log('Erro ao listar as produtos', erro);
        res.render('produtosTelas/lista', { mensagem: erro })

    }
})




router.get('/novo', async (req, res) => {
    try {
        const resultado = await BD.query('select * from categorias order by nome_categoria')
        res.render('produtosTelas/criar', { vetorDados: resultado.rows })

    } catch (erro) {
        console.log('Erro ao listar as produtos', erro);
        res.render('produtosTelas/lista', { mensagem: erro })

    }
})

router.post('/novo', async (req, res) => {
    try {
        const nome = req.body.nome
        const estoque = req.body.estoque
        const estoque_min = req.body.estoque_min
        const valor = req.body.valor
        const imagem = req.body.imagem
        const id_categoria = req.body.id_categoria
        await BD.query('insert into produtos (nome_produto, estoque,estoque_minimo,valor,imagem,id_categoria) values ($1, $2,$3,$4,$5,$6)', [nome,estoque,estoque_min,valor,imagem,id_categoria ])

        res.redirect('/produtos/')



    } catch (erro) {
        console.log('Erro ao listar as diciplinas', erro);
        res.redirect('/produtos/')

    }
})

router.post('/:id/deletar', async (req, res) => {
    const { id } = req.params
    await BD.query('delete from produtos where id_produto = $1', [id])
    res.redirect('/produtos')
})

router.get('/:id/editar', async (req, res) => {
    try {
        const { id } = req.params
        const resultado = await BD.query('select * from produtos where id_produto = $1', [id])

        const Cadrastrados = await BD.query('select * from categorias order by nome_categoria')

        const movimentacoes = await BD.query(`select movimentacoes.tipo_movimentacao, TO_CHAR(movimentacoes.data_movimentacao, 'DD/MM/YYYY') AS data_movimentacao, movimentacoes.quantidade,  movimentacoes.descricao, movimentacoes.estoque from movimentacoes where id_produto = $1`,
      [id])
        res.render('produtosTelas/editar', {
            produtos: resultado.rows[0],
            categoriaCadastrados: Cadrastrados.rows,
            movimentacoes: movimentacoes.rows
        })


    } catch (erro) {

        console.log('Erro ao editar disciplina', erro)


    }
})

router.post('/:id/editar', async (req, res) => {
    try {
        const { id } = req.params
        const { nome_produto,estoque,estoque_minimo,valor,imagem,id_categoria } = req.body
        await BD.query('update produtos set nome_produto = $1, estoque = $2, estoque_minimo=$3, valor = $4, imagem=$5,id_categoria=$6  where id_produto = $7', [nome_produto,estoque,estoque_minimo,valor,imagem,id_categoria, id])
        res.redirect('/produtos/')

const Movimentacoes = await BD.query("select *, TO_CHAR(data_movimentacao, 'DD/MM/YYYY') AS data from movimentacoes where id_produto = $1 order by id_movimentacao", [id])


    } catch (erro) {

        console.log('Erro ao gravar disciplina', erro)


    }
})

router.post("/:id/lancar-nota", async (req, res) => {
    const { id } = req.params;
    const id_usuario = req.session.idUsuario
    const {
      data_movimentacao,
      tipo_movimentacao,
      quantidade,
      descricao,
    } = req.body;
  
    await BD.query(
      `insert into movimentacoes (id_produto,id_usuario,data_movimentacao,tipo_movimentacao,quantidade,descricao)  values($1,$2,$3,$4,$5,$6)`,
      [
        id,
        id_usuario,
        data_movimentacao,
        tipo_movimentacao,
        quantidade,
        descricao,
      ]
    );

  
    res.redirect(`/produtos/${id}/editar`);
  });

module.exports = router