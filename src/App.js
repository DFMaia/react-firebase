import { useState, useEffect } from 'react';
import './style.css';
import firebase from './firebaseConnection';

function App() {

  const[idPost, setIdPost] = useState('');
  const[titulo, setTitulo] = useState('');
  const[autor, setAutor] = useState('');
  const[posts, setPosts] = useState([]);
  
  const[email, setEmail] = useState('');
  const[senha, setSenha] = useState('');
  const[user, setUser] = useState(false);
  const[userLogged, setUserLogged] = useState({});

  useEffect(()=>{
    async function loadPosts(){
      await firebase.firestore().collection('posts')
      .onSnapshot((doc)=>{
        let meusPosts = [];

        doc.forEach((item) => {
          meusPosts.push({
            id: item.id,
            titulo: item.data().titulo,
            autor: item.data().autor,

          })
        });

        setPosts(meusPosts);

      })
    }

    loadPosts();

  }, []);


  useEffect(() => {
    async function checklogin(){
      //monitora se há usuário logado ou não. 
      await firebase.auth().onAuthStateChanged((user) => {
        if(user){
          setUser(true);
          setUserLogged({
            uid: user.uid,
            email: user.email
          })
        }else{
          setUser(false);
          setUserLogged({});
        }
      })
    }

    checklogin();

  },[]);

  async function handleAdd(){
    await firebase.firestore().collection('posts')
    .add({
      titulo: titulo,
      autor: autor,
    })
    .then(()=> {
      console.log("Dados cadastrados com sucesso.");
      setTitulo('');
      setAutor('');
    })
    .catch((error) => {
      console.log("Gerou algum erro: " + error)
    })
  }

  async function buscaPost(){
    /*await firebase.firestore().collection('posts')
    .doc('123')
    .get()
    .then((snapshot) => {
      setTitulo(snapshot.data().titulo);
      setAutor(snapshot.data().autor);
    })
    .catch(()=> {
      console.log("Deu algum erro")
    })*/

    await firebase.firestore().collection('posts')
    .get()
    .then((snapshot)=>{
      let lista = [];
      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor
        })
      })

      setPosts(lista);
    })
    .catch(()=>{
      console.log("Deu algum erro")
    })
  }

async function editarPost(){
  await firebase.firestore().collection('posts')
  .doc(idPost)
  .update({
    titulo: titulo,
    autor: autor
  })
  .then(()=>{
    console.log('Dados atualizados com sucesso');
    setIdPost('');
    setTitulo('');
    setAutor('');
  })
  .catch(()=>{
    console.log('Erro ao atualizar')
  });
}


async function excluirPost(id){
  await firebase.firestore().collection('posts')
  .doc(id)
  .delete(id)
  .then(() => {
    alert('Esse post foi excluido')
  })
}

async function novoUsuario(){
  await firebase.auth().createUserWithEmailAndPassword(email, senha)
  .then((value)=>{
    console.log(value)
  })
  .catch((error)=>{
    if(error.code === 'auth/weak-password'){
      alert('Senha muito fraca')
    }else if(error.code === 'auth/email-already-in-use'){
      alert('Esse e-mail já existe');
    }
  })
  setEmail('');
  setSenha('');
}

async function logout(){
  await firebase.auth().signOut();
}

async function fazerLogin(){
  await firebase.auth().signInWithEmailAndPassword(email, senha)
  .then((value)=> {
    console.log(value.user);
  })
  .catch((error)=>{
    console.log('Erro ao fazer login' + error);
  })
}


  return (
    <div>
      <h1>React JS + firebase :)</h1><br/>

      {user && (
        <div>
          <strong>Seja bem vindo! (Você está logado!)</strong><br/>
          <span>{userLogged.uid} - {userLogged.email}</span>
          <br/><br/>
        </div>
      )}

      <div className="container">
        <label>Email</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>

        <label>Senha</label>
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)}/>

        <button onClick={ fazerLogin }>Fazer Login</button>
        <button onClick={novoUsuario} >Cadastrar</button>
        <button onClick={logout}>Sair da conta</button>
      </div>

      <hr/><br/>

    <div className="container">
      <h2>Banco de Dados</h2>
      <label>ID: </label>
      <input type={"text"} value={idPost} onChange={ (e) => setIdPost(e.target.value) } />

      <lable>Título: </lable>
      <textarea type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />

      <label>Autor: </label>
      <input type="text" value={autor} onChange={(e) => setAutor(e.target.value)}/>

      <button onClick={handleAdd}>Cadastrar</button>
      <button onClick={buscaPost}>Buscar post</button><br/>
      <button onClick={editarPost}>Editar</button><br/>
      <ul>
        {posts.map((post) => {
          return(
            <li key={post.id}>
              <span>ID - {post.id} </span><br/>
              <spam>Título: {post.titulo}</spam><br/>
              <span>Autor: {post.autor}</span><br/><br/>
              <button onClick={()=> excluirPost(post.id)}>Excluir post</button><br/><br/>
            </li>
          )
        })}
      </ul>

    </div>

    </div>
  );
}

export default App;
