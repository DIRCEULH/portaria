class LoginService {
   async login(jsonValuesUsers) {

      await $.ajax({
         method: 'get',
         url: "../rotaLogin.php",
         data: { rota: 'login', jsonValuesUsers }
      }).then(function (data) {

         const users = JSON.parse(data)

         if (users[0].total == 1) {
            $('#alert').hide()
            const id = encode(users[0].id_atendente)
            const usuario = encode(users[0].nome_atendente)
            const logado = encode('ok')
            const url = `logado=${logado}&usuario=${usuario}&id_usuario=${id}`
            window.location.href = `index.html?${url}`
         } else {
            $('#alert').show()
         }

      })

   }
}