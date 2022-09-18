const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const Posts = require('./Posts.js');
const Sobre = require('./Sobre.js');
require('dotenv').config();
const Port = process.env.DB_PORT;
const User = process.env.DB_USER;
const Password = process.env.DB_PASSWORD;
const DB = process.env.DB_NAME;

//conexao com o banco de dados mongoose
mongoose.connect(`mongodb+srv://${User}:${Password}@cluster0.b5xis.mongodb.net/${DB}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conexão com o banco de dados realizada com sucesso!');
}).catch(err => {
  console.log('Erro ao conectar com o banco de dados: ' + err);
});

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/pages'));


app.get('/', (req, res) => {

  if (req.query.busca == null) {
    Posts.find({}).sort({ '_id': -1 }).exec((err, posts) => {
      //console.log(posts[0]);
      posts = posts.map((val) => {
        return {
          titulo: val.titulo,
          conteudo: val.conteudo,
          descricaoCurta: val.conteudo.substr(0, 30),
          imagem: val.imagem,
          slug: val.slug,
          categoria: val.categoria,
          views: val.views,
          link: val.link,
        }
      })

      Posts.find({}).sort({ 'views': -1 }).limit(2).exec((err, postsTop) => {
        //console.log(posts[0]);
        postsTop = postsTop.map((val) => {
          return {
            titulo: val.titulo,
            conteudo: val.conteudo,
            descricaoCurta: val.conteudo.substr(0, 30),
            imagem: val.imagem,
            slug: val.slug,
            categoria: val.categoria,
            views: val.views,
            link: val.link,
          }
        })
        res.render('home', { posts: posts, postsTop: postsTop });
      })

    })
  } else {

    Posts.find({ titulo: { $regex: req.query.busca, $options: 'i' } }, (err, posts) => {
      console.log(posts);
      posts = posts.map((val) => {
        return {
          titulo: val.titulo,
          conteudo: val.conteudo,
          descricaoCurta: val.conteudo.substr(0, 30),
          imagem: val.imagem,
          slug: val.slug,
          categoria: val.categoria,
          views: val.views,
          link: val.link,
        }
      })
      res.render('busca', { posts: posts, contagem: posts.length });
    })
  }
});


app.get('/:slug', (req, res) => {
  //res.send(req.params.slug);
  Posts.findOneAndUpdate({ slug: req.params.slug }, { $inc: { views: 1 } }, { new: true }, function (err, resposta) {
    //console.log(resposta);
    if (resposta != null) {

      Posts.find({}).sort({ 'views': -1 }).limit(0).exec((err, postsTop) => {
        //console.log(postsTop[0]);
        postsTop = postsTop.map((val) => {
          return {
            titulo: val.titulo,
            conteudo: val.conteudo,
            descricaoCurta: val.conteudo.substr(0, 30),
            imagem: val.imagem,
            slug: val.slug,
            categoria: val.categoria,
            views: val.views,
            link: val.link,
          }
        });
        res.render('single', { noticia: resposta, postsTop: postsTop });
      })
    } else {
      res.redirect('/');
    }
  });
});


app.get('/pages/sobre.html', (req, res) => {

  Sobre.find({}, (err, sobre) => {
    console.log(sobre[0]);
    sobre = sobre.map((val) => {
      return {
        titulo: val.titulo,
        imagem: val.imagem,
        categoria: val.categoria,
        conteudo: val.conteudo,
        descricaoCurta: val.conteudo.substr(0, 30),
        slug: val.slug,
        autor: val.autor,
        views: val.views,
        link: val.link,
        conteudo2: val.conteudo2,
        imagem2: val.imagem2,
        imagem3: val.imagem3,
        imagem4: val.imagem4,
      }
    })
    res.render('sobre', { sobre: sobre });
  });
});


app.get('/pages/contato.html', (req, res) => {
  res.render('contato');
});

app.get('/pages/servicos.html', (req, res) => {
  res.render('servicos');
});

app.listen(Port, () => {
  console.log('Server rodando na porta = ' + Port)
});