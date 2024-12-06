const express = require('express')
const path = require('path')
const session = require('express-session')

const app = express();

app.set('views', path.join(__dirname, 'views'));           // Configura o diretório das views
app.set('view engine', 'ejs')                              //Configura o motor de templates para EJS
app.use(express.static(path.join(__dirname, 'public')));   //Define pasta para arquivos css / img
app.use(express.urlencoded({ extended: true }))            //Para processar os dados do formulário
app.use(express.json());

app.use(session({
    secret: 'sesisenai', // Um segredo para assinar a sessão
    resave: false, // Não salva a sessão se não houver modificações6   
    saveUninitialized: false // Não salva uma sessão vazia
}));
// Middleware para verificar se o usuário está logado
// e disponibilizar a sessão em todas as views
const verificarAutenticacao = (req, res, next) => {
    if (req.session.usuarioLogado) {
        res.locals.usuarioLogado = req.session.usuarioLogado || null;
        res.locals.nomeUsuario = req.session.nomeUsuario || null;
        res.locals.idUsuario = req.session.idUsuario || null;
        next(); // Usuário está logado, pode continuar
    } else {
        res.redirect('/auth/login'); // Redireciona para a página de login
    }
}

app.get('/', (req, res) => {
    res.render('landing/index')
})

app.get('/sobre', (req, res) => {
    res.render('landing/sobre')
})

const adminRotas = require('./routes/adminRotas')
app.use('/admin', verificarAutenticacao, adminRotas)

const categoriasRotas = require('./routes/categoriasRotas')
app.use('/categorias', verificarAutenticacao, categoriasRotas)

// const movimentacaoRotas = require('./routes/movimentacaoRotas')
// app.use('/movimentacoes', verificarAutenticacao, movimentacaoRotas)

const produtoRotas = require('./routes/produtosRotas')
app.use('/produtos', verificarAutenticacao, produtoRotas)


const loginRotas = require('./routes/loginRotas.js')
app.use('/auth', loginRotas)


const usuariosRotas = require('./routes/usuariosRotas')
app.use('/usuarios', verificarAutenticacao, usuariosRotas)








const porta = 3000
app.listen(porta, () => {
    console.log(`servidor esta rolando http://localhost:${porta}`)
})


