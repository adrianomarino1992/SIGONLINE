// autor: Adriano Marino Balera adriano.marino1992@gmail.com
// Feito no Estagio Jacareí/Fatec 2018/2019

var express = require('express');
var https = require('https');
var fs = require('fs');
var path = require('path');
var serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const sql = require("mssql");
var url = require('url');
var nodemailer = require('nodemailer');
const { Pool, Client } = require('pg');
var formidable = require('formidable');





var app = express();
app.use(serveStatic(__dirname))




app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

// var connStr = "Server=mi3-wsq2.a2hosting.com;Database=felipeca_aten;User Id=felipeca_aten;Password=aten@2018;";
// sql.connect(connStr)
//     .then(conn => global.conn = conn)
//     .catch(err => console.log(err));
// function execSQLQuery(sqlQry, res) {
//     global.conn.request()
//         .query(sqlQry)
//         .then(result => res.json(result.recordset))
//         .catch(err => res.json({ 'erro': err }));
// };
var d = new Date();
var pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'bd_sma',
    password: '123',
    port: 5432,
})



// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'estagiojacarei@gmail.com',
//       pass: 'adeef123'
//     }
//   });

//   var mailOptions = {
//     from: 'estagiojacarei@gmail.com',
//     to: 'estagiojacarei@gmail.com',
//     subject: 'Sending Email using Node.js',
//     html: `<h3>Obrigado por se cadastrar, para finalizar seu cadastro, acesse a url abaixo :</h3>
//     <a target="_blank" href=""></a>`
//   };

//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });





// ============================================== CHAVES PARA CRIAR HTTPS ============================================================
// https.createServer({
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert'),
// },
app.get('/intersects', function (req, res) {
    var q = url.parse(req.url, true).query;
    var geom = q.geom;
    var secretaria = q.secretaria;
    var cat = q.categoria;
    var tb;
    var descricao;
    var data;
    var situacao;

    if (secretaria) {
        if (secretaria == "'Meio_Ambiente'") {

            tb = 'vDenuncia';
            descricao = 'descricaoDenuncia';
            data = 'dataDenuncia';
            situacao = 'situacaoDenuncia';
        } else {
            tb = 'vOcorrencia';
            descricao = 'descricaoOcorrencia';
            data = 'dataOcorrencia';
            situacao = 'situacaoOcorrencia';
        }
    }
// autor: Adriano Marino Balera adriano.marino1992@gmail.com
// Feito no Estagio Jacareí/Fatec 2018/2019

    // console.log(`SELECT protocolo from ${tb} where @g.STIntersects(geom) = 1 AND categoria = ${cat} ;  `);
    execSQLQuery(`DECLARE @g geometry;  
        SET @g = geometry::STGeomFromText(${geom}, 4326);  
        SELECT protocolo, idCidadao, categoria, subcategoria,${descricao},${situacao},${data},Lng, Lat, endereco  from ${tb} where @g.STIntersects(geom) = 1 AND categoria = ${cat} ;  `, res);

});


// autor: Adriano Marino Balera adriano.marino1992@gmail.com
// Feito no Estagio Jacareí/Fatec 2018/2019

app.get('/adiconar/cidadao', function (req, res) {
    var q = url.parse(req.url, true).query;
    var nome = q.nome;
    var cpf = q.cpf;
    var senha = q.senha;
    var email = q.email;
    var celular = q.celular;
    var nascimento = q.nascimento;
    var cep = q.cep;
    var bairro = q.bairro;
    var rua = q.rua;
    var numero = q.numero;
    var complemento = q.complemento;
    var insert = `INSERT INTO tbCidadao(nomeCidadao,cpf,senhaCidadao,emailCidadao,celularCidadao,nascimento,cep,bairro,rua,numero,complemento)
    VALUES('${nome}','${cpf}','${senha}','${email}','${celular}','${nascimento}','${cep}','${bairro}','${rua}','${numero}','${complemento}')`;
    var checkCPF = `SELECT * FROM tbCidadao where cpf = '${cpf}'`;
    var teste;
    global.conn.request()
        .query(checkCPF)
        .then(result => checkCPFfunction(result.recordset.length))
        .catch(err => res.json({ 'erro': err }));

    function checkCPFfunction(value) {
        if (value == 0) {
            global.conn.request()
                .query(insert)
                .then(result => res.json({ 'sucesso': 'Cadastro realizado com sucesso !' }))
                .catch(err => res.json({ 'erro': err }));
        } else {
            res.json({ 'erro': 'Lamento, ja existe um cadastro relacionado a esse cpf !' });
        }

    }


    console.log(`O ip: ${req.ip} realizou uma operação em : ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`);


})

app.get('/redefinir/senha', function (req, res) {
    var q = url.parse(req.url, true).query;
    var cpf = q.cpf;
    global.conn.request()
        .query(`select emailCidadao from tbCidadao where cpf = '${cpf}'`)
        .then(result => sendMailtoRedefirSenha(result.recordset))
        .catch(err => res.json({ 'erro': err }));

    function sendMailtoRedefirSenha(value) {
        var val = JSON.stringify(value);
        val = JSON.parse(val);
        if (val.length == 1) {
            var emailcidadao = val[0].emailcidadao;
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'estagiojacarei@gmail.com',
                    pass: 'adeef123'
                }
            });

            var mailOptions = {
                from: 'estagiojacarei@gmail.com',
                to: emailcidadao,
                subject: 'Redefinir senha',
                html: `<h3>Obrigado por se cadastrar, para finalizar seu cadastro, acesse a url abaixo :</h3>
    <a target="_blank" href=""></a>`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    }
})

app.post('/buffer', function (req, res) {
    console.log(`O ip: ${req.ip} realizou uma operação em : ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`);


    var geomWKT = req.body.geom;
    var buffer = req.body.buffer;

    pool.query(`select ST_asText(ST_Buffer(ST_geomFromText('${geomWKT}',4326),${buffer})) as "geom"`, (err, resp) => {
        if (resp) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resp.rows));
            //console.log(JSON.stringify(resp.rows));
        } else {
            res.setHeader('Content-Type', 'application/json');
            var error = err;
            res.send(JSON.stringify({ erro: error.toString() }));
            //   console.log({ erro: error.toString() });
        }

    })




});


app.post('/update/geom', function (req, res) {


    var consulta = req.body.consulta;

    console.log(`O ip: ${req.ip} realizou uma operação em : ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`);

    pool.query(consulta, (err, resp) => {
        if (resp) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resp.rows));
            // console.log(JSON.stringify(resp.rows));
        } else {
            res.setHeader('Content-Type', 'application/json');
            var error = err;
            res.send(JSON.stringify({ erro: error.toString() }));

            //   console.log({ erro: error.toString() });
        }

    })


});

app.post('/upload/file/features', function (req, res) {
    var q = url.parse(req.url, true).query;
    var nomeFile = q.nome;
    var gid = q.gid;
    var arquivo = q.arquivo;
    var descricao = q.descricao;
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file) {
        file.path = `C:/Users/FATEC/Desktop/MapaAtual/bd_arquivos/${nomeFile}${file.name}`;
    });

    form.on('file', function (name, file) {
        console.log(`O ip: ${req.ip} realizou uma operação em : ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`);
        var consulta = `INSERT INTO arquivos_features(tabela,gid,arquivo,descricao) values('${arquivo}',${gid},'${nomeFile}${file.name}','${descricao}');`;
        pool.query(consulta, (err, resp) => {
            if (resp) {
                // res.setHeader('Content-Type', 'application/json');
                // res.send(JSON.stringify(resp.rows));
                console.log(consulta);
            } else {
                // res.setHeader('Content-Type', 'application/json');
                var error = err;
                // res.send(JSON.stringify({ erro: error.toString() }));

                console.log({ erro: error.toString() });
            }

        })

    });

    res.json({ sucesso: 'arquivo recebido!' });
})

app.get('/acessar/arquivos', function (req, res) {
    var q = url.parse(req.url, true).query;
    var gid = q.gid;
    var arquivo = q.arquivo;
    var consulta = `SELECT * FROM arquivos_features WHERE gid = ${gid} AND tabela = '${arquivo}'`;
    // console.log(consulta);
    pool.query(consulta, (err, resp) => {
        if (resp) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resp.rows));
            // console.log(JSON.stringify(resp.rows));
        } else {
            res.setHeader('Content-Type', 'application/json');
            var error = err;
            res.send(JSON.stringify({ erro: error.toString() }));

            // console.log({ erro: error.toString() });
        }

    })

})
// autor: Adriano Marino Balera adriano.marino1992@gmail.com
// Feito no Estagio Jacareí/Fatec 2018/2019
app.get('/fontededados/contemfiles', function (req, res) {
    var consulta = `SELECT tabela, count(*) FROM arquivos_features GROUP BY tabela `;
    pool.query(consulta, (err, resp) => {
        if (resp) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resp.rows));
            // console.log(JSON.stringify(resp.rows));
        } else {
            res.setHeader('Content-Type', 'application/json');
            var error = err;
            res.send(JSON.stringify({ erro: error.toString() }));

            // console.log({ erro: error.toString() });
        }

    })

})
// autor: Adriano Marino Balera adriano.marino1992@gmail.com
// Feito no Estagio Jacareí/Fatec 2018/2019
app.get('/acessar/files/tabela', function (req, res) {

    var q = url.parse(req.url, true).query;
    var tabela = q.tabela;
    var consulta = `SELECT * FROM arquivos_features where tabela = '${tabela}' `;
    pool.query(consulta, (err, resp) => {
        if (resp) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resp.rows));
            // console.log(JSON.stringify(resp.rows));
        } else {
            res.setHeader('Content-Type', 'application/json');
            var error = err;
            res.send(JSON.stringify({ erro: error.toString() }));

            // console.log({ erro: error.toString() });
        }

    })

})

app.get('/consulta/tabular', function (req, res) {
    console.log(`O ip: ${req.ip} realizou uma operação em : ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`);
    var q = url.parse(req.url, true).query;
    var secretaria = q.secretaria;
    var consulta = q.consulta;
    var protocolo = q.protocolo;
    if (secretaria) {
        // console.log(secretaria);
        // console.log(consulta);
        // console.log(consulta == 'protocolo');
        if (consulta == 'protocolo') {

            if (secretaria == "Meio_Ambiente") {
                //   console.log(`select * from tbDenuncia where protocolo = ${protocolo}`);
                execSQLQuery(`select * from tbDenuncia where protocolo = ${protocolo}`, res);
            }
        } else {
            if (secretaria == "Meio_Ambiente") {

                switch (consulta) {
                    case "Quantidade de Denuncias": execSQLQuery(`select categoria, count(*) as "Quantidade" from tbDenuncia group by categoria order by "Quantidade" desc;`, res); break;
                    case "Denuncia resolvidas": execSQLQuery(`select categoria, count(*) as "Quantidade" from tbDenuncia where situacaoDenuncia = 'RESOLVIDO' group by categoria order by "Quantidade" desc;`, res); break;
                    case "Denuncias mais frequentes": execSQLQuery(`select subcategoria, count(*) as "Quantidade" from tbDenuncia group by subcategoria order by "Quantidade" desc;`, res); break;


                }
            }
        }



    }


})
app.get('/pastas/dados', function (req, res) {
    var q = url.parse(req.url, true).query;
    var arquivo = q.arquivo;
    var consulta = `select *, ST_AsText(ST_Transform(geom,4326)) as "geometry"  from ${arquivo}`;
    pool.query(consulta, (err, resp) => {
        if (resp) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resp.rows));
            // console.log(JSON.stringify(resp.rows));
        } else {
            res.setHeader('Content-Type', 'application/json');
            var error = err;
            res.send(JSON.stringify({ erro: error.toString() }));

            //  console.log({ erro: error.toString() });
        }

    })
})
app.get('/pastas/dados/update', function (req, res) {
    console.log(`O ip: ${req.ip} realizou uma operação em : ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`);
    var q = url.parse(req.url, true).query;
    var consulta = q.consulta;
    pool.query(consulta, (err, resp) => {
        if (resp) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resp.rows));
            // console.log(JSON.stringify(resp.rows));
        } else {
            res.setHeader('Content-Type', 'application/json');
            var error = err;
            res.send(JSON.stringify({ erro: error.toString() }));

            // console.log({ erro: error.toString() });
        }

    })
})
app.get('/openScript', function (req, res) {
    var js;
    js = fs.readFileSync('js/script.js', 'utf8');
    res.json({ script: js });
})

app.get('/createjs', function (req, res) {  // ROTA DE CONTROLE DE ACESSO ================================
    var js;
    // if (req.ip == `::ffff:10.68.54.182` || req.ip == `::ffff:10.68.54.169`) {
    //     js = fs.readFileSync('js/main.js', 'utf8');
    // } else {
    //     js = `alert('VC NÃO TEM ACESSO GAY')`;
    // }

    // console.log(req.hostname);
    res.json({ script: js });

    res.end();

})

app.get('/terminal/query/sqlserver', function (req, res) {
    console.log(`O ip: ${req.ip} realizou uma operação em : ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`);
    var q = url.parse(req.url, true).query;
    var linha = q.linha;
    execSQLQuery(linha, res);

})// autor: Adriano Marino Balera adriano.marino1992@gmail.com
// Feito no Estagio Jacareí/Fatec 2018/2019

app.get('/terminal/query/postgres', function (req, res) {
    console.log(`O ip: ${req.ip} realizou uma operação em : ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`);
    var q = url.parse(req.url, true).query;
    var linha = q.linha;
    pool.query(linha, (err, resp) => {
        if (resp) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resp.rows));
            //  console.log(JSON.stringify(resp.rows));
        } else {
            res.setHeader('Content-Type', 'application/json');
            var error = err;
            res.send(JSON.stringify({ erro: error.toString() }));

            //  console.log({ erro: error.toString() });
        }

    })

})

app.get('/query/fiscalizacao', function (req, res) {
    var q = url.parse(req.url, true).query;
    var secretaria = q.secretaria;
    var cat = q.categoria;
    var sub_cat = q.subcategoria;
    var status = q.status;
    var tb;
    var descricao;
    var data;
    var situacao;
    if (secretaria) {
        if (secretaria == "'Meio_Ambiente'") {

            tb = 'vDenuncia';
            descricao = 'descricaoDenuncia';
            data = 'dataDenuncia';
            situacao = 'situacaoDenuncia';
        } else {
            tb = 'vOcorrencia';
            descricao = 'descricaoOcorrencia';
            data = 'dataOcorrencia';
            situacao = 'situacaoOcorrencia';
        }
    }

    var consulta = `SELECT protocolo, idCidadao, categoria, subcategoria,${descricao},${situacao},${data},Lng, Lat, endereco  from ${tb} where categoria = '${cat}' and subcategoria = '${sub_cat}' and ${situacao} = '${status}' ;`;
    // console.log(consulta);

    global.conn.request()
        .query(consulta)
        .then(result => res.json(result.recordset))
        .catch(err => res.json({ 'erro': err }));


})

app.get('/login/cidadao', function (req, res) {
    var q = url.parse(req.url, true).query;
    var user = q.user;
    var senha = q.senha;
    // execSQLQuery(`select * from tbCidadao where cpf = '${user}' and senhaCidadao = '${senha}';`,res);

    global.conn.request()
        .query(`select * from tbCidadao where cpf = '${user}' and senhaCidadao = '${senha}';`)
        .then(result => UserExistes(result.recordset, res))
        .catch(err => res.json({ 'erro': `usuario ou senha incorretos` }));





})

app.get('/login/funcionario', function (req, res) {
    var q = url.parse(req.url, true).query;
    var user = q.user;
    var senha = q.senha;
    // execSQLQuery(`select * from tbCidadao where cpf = '${user}' and senhaCidadao = '${senha}';`,res);
    // console.log(req.ip); 





})

function UserExistes(obj, res) {


    //console.log(obj);
    if (obj.length == 1) {
        // var js;
        // js = fs.readFileSync('js/addScript2User.js', 'utf8');
        res.json({ 'user': obj });

    } else {
        res.json({ 'erro': `usuario ou senha incorretos` });
    }



}

function FuncionarioExistes(obj, res) {

// autor: Adriano Marino Balera adriano.marino1992@gmail.com
// Feito no Estagio Jacareí/Fatec 2018/2019

    // console.log(obj);
    if (obj.length == 1) {
        var js;
        js = fs.readFileSync('js/addScriptToTerminal.js', 'utf8');
        res.json({ 'user': obj, 'script': js });

    } else {
        res.json({ 'erro': `usuario ou senha incorretos` });
    }





}
app.get('/download/add_files', function (req, res) {
    var q = url.parse(req.url, true).query;
    var arquivo = q.arquivo;
    var file = __dirname + `/bd_arquivos/${arquivo}`;
    res.download(file);
});

app.get('/download', function (req, res) {
    var q = url.parse(req.url, true).query;
    var pasta = q.pasta;
    var diretorio = q.diretorio;
    var file = __dirname + `/public/${pasta}/${diretorio}`;
    res.download(file); // Set disposition and send it.
});

app.get('/listarAllFiles', function (req, res) {
    var q = url.parse(req.url, true).query;
    var pasta = q.pasta;
    var allfiles = { files: [] };
    const public = __dirname + `/public/${pasta}`;

    var files = fs.readdirSync(public);
    for (var file of files) {
        allfiles.files.push({ nome: file });
    }
    res.json(allfiles);
})

// autor: Adriano Marino Balera adriano.marino1992@gmail.com
// Feito no Estagio Jacareí/Fatec 2018/2019

// var pool = new Pool({
//     user: 'postgres',
//     host: '10.68.54.16',
//     database: '_moburb',
//     password: '123',
//     port: 5432,
// })

// app.get('/enderecos/origem', function (req, res) {



//     var consulta = `select v06,v08 from mujac_1 group by v06,v08 order by v08`;
//      console.log(consulta);
//     pool.query(consulta, (err, resp) => {
//         if (resp) {
//             res.setHeader('Content-Type', 'application/json');
//             res.send(JSON.stringify(resp.rows));
//             console.log(JSON.stringify(resp.rows));
//         } else {
//             res.setHeader('Content-Type', 'application/json');
//             var error = err;
//             res.send(JSON.stringify({ erro: error.toString() }));

//             console.log({ erro: error.toString() });
//         }

//     })


// });
// app.get('/enderecos/destino', function (req, res) {

// autor: Adriano Marino Balera adriano.marino1992@gmail.com
// Feito no Estagio Jacareí/Fatec 2018/2019

//     var consulta = `select v11,v13 from mujac_1 group by v11,v13 order by v13`;
//      console.log(consulta);
//     pool.query(consulta, (err, resp) => {
//         if (resp) {
//             res.setHeader('Content-Type', 'application/json');
//             res.send(JSON.stringify(resp.rows));
//         } else {
//             res.setHeader('Content-Type', 'application/json');
//             var error = err;
//             res.send(JSON.stringify({ erro: error.toString() }));

//             console.log({ erro: error.toString() });
//         }

//     })


// });









app.listen(443, function () {
    console.log('Servidor rodando na porta 443!');
});
