//CONFIG SERVIDOR//
const express = require ("express")
const server = express ()

//ARQUIVOS ESTATICOS//
server.use (express.static('public'))

//BODY FORM//
server.use(express.urlencoded({extended: true}))

//CONFIR BD//
const Pool = require('pg').Pool
const db = new Pool (
    {
       user: 'postgres',
       password:'1234',
       host:'localhost',
       port:'5432',
       database: 'doe' 
    })

//COMFIGURANDO TEMPLATE ENGINE//
const nunjucks =  require ("nunjucks")
nunjucks.configure ("./", {
    express: server,
    noCache: true, //
})


//ROTAS DA PAGINA//
server.get("/", function (req, res){
    db.query("SELECT * FROM donors", function (err, result){
        if (err) return res.send("erro de banco de dados.")
        const donors = result.rows
        return res.render("index.html", {donors})
    })
    
})

//Dados Form//
server.post("/", function (req, res) {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

    //Inserindo valor dentro do db//
    const query = `INSERT INTO donors ("name", "email", "blood") 
    VALUES($1, $2, $3)` 

    const values =[name, email, blood]

    db.query(query, values, function (err) {
        if (err) return res.send("erro no banco de dados")

        return res.redirect("/")
    })

})

//LIGAR SERVIDOR*/
server.listen(3000, function () {
    console.log("iniciei o servidor.")
})

