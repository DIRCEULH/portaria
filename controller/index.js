
const params = new URLSearchParams(window.location.search);
const logado = params.get('logado')
const usuarioLogado = params.get('usuario')
const id_usuario = params.get('id_usuario')


let paginationInicial = sessionStorage.getItem("paginationInicial") || 0
let paginationFinal = sessionStorage.getItem("paginationFinal") || 4
let dateRegistration = sessionStorage.getItem("dateRegistration")
let colorPagination = sessionStorage.getItem("colorPagination") 

$(function () {
  $('.floating.dropdown')
    .dropdown()
    ;

})

$(function () {

  if (decode(logado) !== 'ok') {
    window.location.href = "login.html"
  } else {
    $('#logado').val(decode(usuarioLogado))
  }


})



/**
 * Formato de calendario apenas data (2023-09-09) Descomentar plugin script no index html.
 */

// $(function () {
//   $("#datepicker, #data_entrada, #data_saida").datepicker({
//     "autoclose": true, dateFormat: 'yyy-dd-mm HH:MM:ss',  showOtherMonths: true,
//     selectOtherMonths: true, dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
//     dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
//     dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
//     monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
//     monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
//   });
// })

/**
 * Formato de calendario com horas (2023-09-09 00:00:00).
 */
$(function () {

  $("#datepicker, #data_entrada, #data_saida").datetimepicker({
    format: 'Y-m-d H:i',
    lang: 'pt-BR',
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    nextText: 'Próximo',
    prevText: 'Anterior',
    mask: '9999-99-99 99:99',
    onClose: function () {
      try {
        $(this).valid();
      }
      catch (e) {
      }
    }
  })

})

const atualizar = async () => {

  sessionStorage.setItem("dateRegistration", $('#datepicker').val())
  sessionStorage.setItem("paginationInicial", 0)
  sessionStorage.setItem("paginationFinal", 10)
  sessionStorage.setItem("colorPagination", 'buttonColor' + 1)

  window.location.reload(true)
}

const SelectAttendants = async () => {

  const attendants = new ClientesService();

  const attendantsRow = await attendants.showAttendants()

  return attendantsRow
}



SelectAttendants().then((attendants) => {

  const responseAttendants = JSON.parse(attendants)



  const HtmlOptionsAttendants = responseAttendants.map((a, i) => {

    if (a.id_atendente == decode(id_usuario)) {

      return `<option id="selected-${a.id_atendente}"  value="${a.id_atendente}">${a.id_atendente} - ${a.nome_atendente}</option>`

    }

  })

  $('.attendants').html(HtmlOptionsAttendants)

})


const ObjectCustomers = async () => {

  const customers = new ClientesService();

  const clientesRow = await customers.showCustomers(dateRegistration)


  return clientesRow
}

const ObjectVisitors = async () => {

  const visitors = new ClientesService();

  const visitorsRow = await visitors.showVisitors()

  return visitorsRow
}

ObjectVisitors().then((visitors) => {

  const responseVisitors = JSON.parse(visitors)
  const HtmlOptionsVisitors = responseVisitors.map((visitor, i) => {

    return ` <div onclick="myFunctionFiltervisitant('${visitor.cpf_cnpj}','${visitor.nome_visitante}')" class="item " id="visitantes">${visitor.nome_visitante}</div>`

  })

  $('.selectFilterVisitors').html(HtmlOptionsVisitors)

})




ObjectCustomers().then((customers) => {

  const responseCustomers = JSON.parse(customers)

  if (responseCustomers.length == 0) {
    $('.alert').show()
    $('.select_visitors').hide()
    $('.date_text').text(`A data filtrada é ${dateRegistration ? dateRegistration : 'Vazia'}`)
  } else {
    $('.alert').hide()
  }

  const HtmlOptions = responseCustomers.map((customer, i) => {

    if (i < paginationFinal && i >= paginationInicial) {

      return ` <option id="selected-${customer.id_visitante}"  value="${customer.id_visitante}">${customer.id_visitante} - ${customer.nome_visitante}</option>`
    }
  })


  const HtmlTable = responseCustomers.map((customer, indice) => {

    if (indice < paginationFinal && indice >= paginationInicial) {

      const heSaid = customer.status == 0

      const functionUpdate = heSaid ? `onclick="modalSaidaVisitante(${customer.id_visitante},'${customer.data_saida}')"` : ""

      return `<tr id="dataTr">
                   <td id="selectedId">${customer.id_visitante}</td>
                   <td id="selectedName"  class="single line"  >
                      ${customer.cpf_cnpj}
                   </td>
                   <td class="single line">
                   <div class="ui icon button" data-tooltip="${customer.nome_visitante}" data-position="bottom left">
                   <i class="user secret icon"></i>
                   </div>
                   </td>
                   <td  class="single line">
                      <div class="ui icon button" data-tooltip="${customer.empresa}" data-position="bottom right">
                      <i class="building icon"></i>
                      </div>
                   </td>
                   <td  class="single line">${customer.data_entrada}</td>
                   <td  ${functionUpdate} class="single line">${customer.data_saida} <i class="calendar check icon"></i></td>
                   <td>
                      <div class="ui icon button" data-tooltip="${customer.placa_veiculo}" data-position="bottom right">
                      <i class="motorcycle icon"></i>
                      </div>                   
                   </td>
                   <td  class="single line">${customer.destino_setor}</td>
                   <td  class="single line">${customer.atendente}</td>
                   <td >
                      <div class="ui icon button" data-tooltip="${customer.observacao}" data-position="bottom right">
                          <i class="add icon"></i>
                      </div>
                   </td>
                  <!--<td><div onclick="confirmDelete(${customer.id_visitante})" class="ui button red" tabindex="0"><i class="trash alternate icon"></i> Excluir</div></td>-->
                  <!--<td><div onclick="modalSaidaVisitante(${customer.id_visitante},'${customer.nome_visitante}','${customer.cpf_cnpj}','${customer.empresa}')" class="ui button " tabindex="0"><i class="edit icon"></i> Editar</div></td>-->
              </tr>`
    }


  })


  let countPagination = 1

  const HtmlPagination = responseCustomers.map((customer, indice) => {

    if (indice < customer.total / 10) {

      const page = countPagination++

      return `<a  onclick="paginationList(${page})" class="item buttonColor${page}">${page}</a>`
    }

  })


  $('.select').html(HtmlOptions)
  $('.cutomers').html(HtmlTable)
  $('.pagination').html(HtmlPagination)

  const classColorPagination = '.' + colorPagination

  $(classColorPagination).css({ "background-color":"#ccc"})

})



const paginationList = (page) => {


  switch (page) {
    case 1:
      sessionStorage.setItem("paginationInicial", 0)
      sessionStorage.setItem("paginationFinal", 10)
      sessionStorage.setItem("colorPagination", 'buttonColor' + page)
      break;
    case 2:
      sessionStorage.setItem("paginationInicial", 10)
      sessionStorage.setItem("paginationFinal", 20)
      sessionStorage.setItem("colorPagination", 'buttonColor' + page)
      break;
    case 3:
      sessionStorage.setItem("paginationInicial",20)
      sessionStorage.setItem("paginationFinal", 30)
      sessionStorage.setItem("colorPagination", 'buttonColor' + page)
      break;
    case 4:
      sessionStorage.setItem("paginationInicial", 30)
      sessionStorage.setItem("paginationFinal", 40)
      sessionStorage.setItem("colorPagination", 'buttonColor' + page)
      break;
    case 5:
      sessionStorage.setItem("paginationInicial", 40)
      sessionStorage.setItem("paginationFinal", 50)
      sessionStorage.setItem("colorPagination", 'buttonColor' + page)
      break;
    case 6:
      sessionStorage.setItem("paginationInicial", 50)
      sessionStorage.setItem("paginationFinal", 60)
      sessionStorage.setItem("colorPagination", 'buttonColor' + page)
      break;
    case 7:
      sessionStorage.setItem("paginationInicial", 60)
      sessionStorage.setItem("paginationFinal", 70)
      sessionStorage.setItem("colorPagination", 'buttonColor' + page)
      break;
    case 8:
      sessionStorage.setItem("paginationInicial", 70)
      sessionStorage.setItem("paginationFinal", 80)
      sessionStorage.setItem("colorPagination", 'buttonColor' + page)
      break;
    case 9:
      sessionStorage.setItem("paginationInicial", 80)
      sessionStorage.setItem("paginationFinal", 90)
      sessionStorage.setItem("colorPagination", 'buttonColor' + page)
      break;
    case 10:
      sessionStorage.setItem("paginationInicial", 90)
      sessionStorage.setItem("paginationFinal", 100)
      sessionStorage.setItem("colorPagination", 'buttonColor' + page)
      break;
    case 11:
      sessionStorage.setItem("paginationInicial", 100)
      sessionStorage.setItem("paginationFinal", 110)
      sessionStorage.setItem("colorPagination", 'buttonColor' + page)
      break;
    case 12:
      sessionStorage.setItem("paginationInicial", 110)
      sessionStorage.setItem("paginationFinal", 120)
      sessionStorage.setItem("colorPagination", 'buttonColor' + page)
      break;              
    case 13:
      sessionStorage.setItem("paginationInicial", 90)
      sessionStorage.setItem("paginationFinal", 100)
      sessionStorage.setItem("colorPagination", 'buttonColor' + page)
      break;
    case 14:
      sessionStorage.setItem("paginationInicial", 120)
      sessionStorage.setItem("paginationFinal", 130)
      sessionStorage.setItem("colorPagination", 'buttonColor' + page)
      break;     
    case 15:
      sessionStorage.setItem("paginationInicial", 130)
      sessionStorage.setItem("paginationFinal", 140)
      sessionStorage.setItem("colorPagination", 'buttonColor' + page)
      break;  
  default:
      sessionStorage.setItem("paginationInicial", 0)
      sessionStorage.setItem("paginationFinal", 10)
      sessionStorage.setItem("colorPagination", 'buttonColor' + 1)
  }

  window.location.reload(true);

}


const openModalCustomers = () => {

  $('#cpf_cnpj').val('')
  $('#nome_visitante').val('')
  $('.nome_visitante').hide()
  $('.cpf_cnpj').hide()
  $('.data_entrada').hide()
  $('.atendente').hide()
  $('.placa_veiculo').hide()
  $('.destino').hide()
  $('.empresa').hide()
  $('#modalInserCostumer').modal({
    escapeClose: false,
    clickClose: false,
    showClose: true,
    closeClass: 'icon-remove'
  })
  $('#modalInserCostumer').draggable()

}

const openModalAttendant = () => {
  $('.nome_atendente').hide()
  $('.matricula_atendente').hide()

  $('#modalInserAtendente').modal({
    escapeClose: false,
    clickClose: false,
    showClose: true,
    closeClass: 'icon-remove'
  })
  $('#modalInserAtendente').draggable()

}

const modalSaidaVisitante = (id_visitante, data_saida) => {
  $('.id_visitante').hide()
  $('.data_saida').hide()

  $('#modalSaidaVisitante').modal({
    escapeClose: false,
    clickClose: false,
    showClose: true
  })
  $('#modalSaidaVisitante').draggable()
  $('#id_visitante').val(id_visitante)
  $('#data_saida').val(data_saida)
}

const saveCustomersButton = async () => {

  const nome_visitante = $('#nome_visitante').val()
  const empresa = $('#empresa').val()
  const cpf_cnpj = $('#cpf_cnpj').val()
  const data_entrada = $('#data_entrada').val()
  const atendente = $('#atendente').val()
  const placa_veiculo = $('#placa_veiculo').val()
  const destino = $('#destino').val()
  const id_visitante = $('#id_visitante').val()
  const observacao = $('#observacao').val()

  if (nome_visitante !== '' && cpf_cnpj !== ''
    && empresa !== '' && data_entrada !== '__/__/____ __:__'
    && data_saida !== '__/__/____ __:__' && atendente !== ''
    && placa_veiculo !== '' && destino !== ''
  ) {

    const customers = new ClientesService();

    const json_values = { id_visitante, nome_visitante, cpf_cnpj, empresa, data_entrada, atendente, placa_veiculo, destino, observacao }

    await customers.saveCustomers(json_values)

    window.location.reload(true);

  } else if (nome_visitante == '') {
    $('.nome_visitante').show()

  } else {
    $('.nome_visitante').hide()
  }

  if (cpf_cnpj == '') {
    $('.cpf_cnpj').show()

  } else {
    $('.cpf_cnpj').hide()
  }

  if (data_entrada == '__/__/____ __:__') {
    $('.data_entrada').show()
  } else {
    $('.data_entrada').hide()
  }

  if (data_saida == '__/__/____ __:__') {
    $('.data_saida').show()
  } else {
    $('.data_saida').hide()
  }

  if (placa_veiculo == '') {
    $('.placa_veiculo').show()
  } else {
    $('.placa_veiculo').hide()
  }

  if (atendente == '') {
    $('.atendente').show()
  } else {
    $('.atendente').hide()
  }

  if (destino == '') {
    $('.destino').show()
  } else {
    $('.destino').hide()
  }

  if (empresa == '') {
    $('.empresa').show()
  } else {
    $('.empresa').hide()
  }

}

const saveAtendenteButton = async () => {

  const matricula_atendente = $('#matricula_atendente').val()
  const nome_atendente = $('#nome_atendente').val()

  if (matricula_atendente !== '' && nome_atendente !== '') {

    const attendant = new ClientesService();

    const jsonValuesAttendant = { matricula_atendente, nome_atendente }


    await attendant.saveAttendant(jsonValuesAttendant)

    window.location.reload(true);

  } else if (matricula_atendente == '') {
    $('.matricula_atendente').show()

  } else {
    $('.matricula_atendente').hide()
  }

  if (nome_atendente == '') {
    $('.nome_atendente').show()

  } else {
    $('.nome_atendente').hide()
  }


}

const updateVisitanteButton = async () => {

  const id_visitante = $('#id_visitante').val()
  const data_saida = $('#data_saida').val()

  if (id_visitante !== '' && data_saida !== '__/__/____ __:__' && data_saida !== '0000-00-00 00:00:00') {

    const visitor = new ClientesService();

    const jsonValuesVisitor = { id_visitante, data_saida }

    await visitor.updateVisitor(jsonValuesVisitor)

    window.location.reload(true);

  } else if (data_saida == '__/__/____ __:__' || data_saida == '0000-00-00 00:00:00') {
    $('.data_saida').show()

  } else {
    $('.data_saida').hide()
  }


}

const deleteCustomers = async () => {

  id = $('#id_delete').val()

  const customers = new ClientesService();

  await customers.deleteCustomers(id)

  window.location.reload(true);

}

const confirmDelete = async (id) => {

  $('#id_delete').val(id)

  $('#modalDelete').modal({
    escapeClose: false,
    clickClose: false,
    showClose: false
  })
}

const myFunctionSelect = () => {

  const nameFilter = $('#select').val().toLowerCase()

  $('.cutomers').find('tr').each(function () {
    const textFilter = $(this).find('#selectedId').text()
    const viewFilter = textFilter.toLowerCase().indexOf(nameFilter) >= 0

    $(this).closest('#dataTr').css('display', viewFilter ? 'table-row' : 'none')

  })
}

const myFunctionFiltervisitant = (cpfCnpjVisitor, visitorName) => {

  $('#cpf_cnpj').val(cpfCnpjVisitor)

  $('#nome_visitante').val(visitorName)
}

const myFunctionSearch = () => {

  const nameFilter = $('#search-input').val().toLowerCase()

  $('.cutomers').find('tr').each(function () {

    const textFilter = $(this).find('#selectedName').text()

    const viewFilter = textFilter.toLowerCase().indexOf(nameFilter) >= 0

    $(this).closest('#dataTr').css('display', viewFilter ? 'table-row' : 'none')

  })

}

//essionStorage.clear()