const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')

//Preparamos a informações de acesso ao banco de dados
const dbUrl = 'mongodb+srv://admin:52XeRKHKIzybbHA8@cluster0.wudndpr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const dbName = 'projetoback'
//declaramos a função main()
async function main() {
  //realizamos a conexão com banco de dados
  const client = new MongoClient(dbUrl)

  console.log('conectado ao banco de dados...')

  await client.connect()
  console.log('Banco de dados conectado com sucesso!')


  const db = client.db(dbName)
  const collection = db.collection('personagem')


  const app = express()

  app.get('/', function (req, res) {
    res.send('Hello World!')
  })

  const lista = ['Java', 'kotlin', 'Android']
  //               0       1         2
  //Endpoint Read All [GET] /personagem

  app.get('/personagem', async function (req, res) {

    //Acessamos a lista de itens na collection no MongoDB
    const itens = await collection.find().toArray()

    //Enviamos a lista de itens como resultado
    res.send(itens)
  })

  //Endpoint Real By ID [GET]/personagem/:id
  app.get('/personagem/:id', async function (req, res) {

    //Acessamos o parâmetro de rota ID
    const id = req.params.id


    //Acessar o item na colletion usando o ID
    const item = await collection.findOne({ _id: new ObjectId(id) })

    //checamos se o item obtido é existente
    if (!item) {
      return res.status(408).send('Item não encontrado')
    }
    res.send(item)
  })

  //Sinalizo ao express que estamos usando JSON no body
  app.use(express.json())

  // Endipoint CREATE [POST]/personagem
  app.post('/personagem', async function (req, res) {
    //  Acessamos o BODY da Requisição
    const novoItem = req.body

    // checar se o 'nome' está presente no body
    if (!novoItem || !novoItem.nome) {
      return res.status(400).send('corpo de requisicão deve conter a propriedade `nome`.')
    }
    // Checar se o novo item está na lista ou não
    // if (lista.includes(novoItem)) {
    //   return res.status(409).send('Esse item ja está na lista')
    // }


    //Adicionamos na collection
    await collection.insertOne(novoItem)

    //Exibimos uma mensagem de sucesso
    res.status(201).send(novoItem)

  })

  //Endpoint Update [PUT]/personagem/:id
  app.put('/personagem/:id', async function (req, res) {
    const id = req.params.id
    //checamos se o id - 1 está na lista, exibindo 
    //mensagem caso o item não esteja
    // if (!lista[id - 1]) {
    //   return res.status(408).send('Item não encontrado')
    // }
    // Acessamos o body da requisicão
    const body = req.body


    //checar se o 'nome' está presente no body
    if (!novoItem || !novoItem.nome) {
      return res.status(400).send('corpo de requisicão deve conter a propriedade `nome`.')
    }
    // //Checar se o novo item está na lista ou não
    // if (lista.includes(novoItem)) {
    //   return res.status(409).send('Esse item ja está na lista')
    // }
    //Atualizamos na collection o novoItem pelo id
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: novoItem }
    )

    //Enviamos mensagem de sucesso
    res.send(novoItem)

  })

  //Endpoint DELETE[DELETE]   /personagem/:id
  app.delete('/personagem/:id', async function (req, res) {

    //Acessamos o parâmetro de rota
    const id = req.params.id

    //checamos se o id - 1 está na lista, exibindo 
    //mensagem caso o item não esteja
    // if (!lista[id - 1]) {
    //   return res.status(408).send('Item não encontrado')
    // }
    //Remover o item da lista usando o id-1
    await collection.deleteOne({ _id: new ObjectId(id) })
    //Enviamos uma mensagem de sucesso
    res.send('Item removido com sucesso:' + id)
  })
  app.listen(3000)

}

//executamos a função main
main()