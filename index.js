const params = new URLSearchParams(window.location.search);
const logado = params.get('logado');
const usuarioLogado = params.get('usuario');

if (decode(logado) !== 'ok') {
    window.location.href = "controller/login.html"
}


