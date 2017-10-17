import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import menu from './menu.json';
const url = 'http://lab01.akna.com.br/testes/livros.php';

class App extends Component {

    constructor(){
        super();
        this.state = {livros: []}
    }
    getLivros(){
        fetch(url)
        .then(response => {
            return response.json();
        })
        .then(result => {
            this.setState({livros: result});
            return result;
        });
    }
    componentDidMount(){
        this.getLivros();
    }
    cadastrar(event){
        event.preventDefault();
        fetch(url, {
            method: 'POST', 
            body: JSON.stringify({
                "titulo": this.titulo.value,
                "autor": this.autor.value,
                "preco": parseFloat(this.preco.value)
            }),
            'Content-Type': 'application/json'
        }).then(res => {
            if (res.ok){
                this.getLivros();
                this.titulo.value = '';
                this.autor.value = '';
                this.preco.value = 0;
            }
        })
    }
    remove(livroId){
        fetch(`${url}?id=${livroId}`, {
            method: 'DELETE'
        }).then(res => {
            if(res){
                this.getLivros();
            }
        })
    }
    menuItem(sub){
        return (
            <ul>
                sub.map(v => <li>v.desc</li>)
            </ul>
        )
    }
    montarMenu(a){
        return (
            <ul>
                {a.map(menu => {
                    return <li><a href={menu.url}>{menu.desc}</a>
                        {menu.sub && this.montarMenu(menu.sub)}
                    </li>
                })}
            </ul>
        )
    }
    render() {
        return (
            <div className="container">
                <div className="row mt-5 pt-5">
                    <div className="col-3">
                        <form onSubmit={this.cadastrar.bind(this)}>
                            <div className="form-group">
                                <label>Título</label>
                                <input type="text" name="" id="" className="form-control" placeholder="Título" ref={(input) => { this.titulo = input; }} />
                            </div>
                            <div className="form-group">
                                <label>Autor</label>
                                <input type="text" name="" id="" className="form-control" placeholder="Autor" ref={(input) => { this.autor = input; }} />
                            </div>
                            <div className="form-group">
                                <label>Preco</label>
                                <input type="number" name="" id="" className="form-control" placeholder="Preco" step=".01" ref={(input) => { this.preco = input; }} />
                            </div>
                            <button type="submit" className="btn btn-primary float-right">Cadastrar</button>
                        </form>
                    </div>
                    <div className="col-5">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Título</th>
                                    <th>Autor</th>
                                    <th>Preco</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.livros.sort((a,b) => a.id-b.id).map(livro => {
                                        return (
                                            <tr key={livro.id}>
                                                <th scope="row">{livro.id}</th>
                                                <td>{livro.titulo}</td>
                                                <td>{livro.autor}</td>
                                                <td>{livro.preco}</td>
                                                <td><button className="btn btn-primary" onClick={this.remove.bind(this, livro.id)}>Excluir</button></td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="col-4">
                        {this.montarMenu(menu)}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
