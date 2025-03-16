class ClientesService {

   async updateVisitor(jsonValuesVisitor) {
      
      await $.ajax({
         method: 'get',
         url: "../mapa.php",
         data: {rota:'visitors',jsonValuesVisitor}
      })
  
     }

   async showCustomers() {

      const res = await $.ajax({
         method: 'get',
         url: "../mapa.php",
         data: { rota: 'clientes', dateRegistration}
      }).then(function (data) {
       
         return JSON.parse(data)
      })

      return res

   }

   async showVisitors() {

      const res = await $.ajax({
         method: 'get',
         url: "../mapa.php",
         data: { rota: 'visitorsFilter'}
      }).then(function (data) {
       
         return JSON.parse(data)
      })

      return res

   }

   async saveCustomers(json_values) {
    
      await $.ajax({
         method: 'get',
         url: "../mapa.php",
         data: { rota: 'saveCustomers', json_values}
      })

   }

   async saveAttendant(jsonValuesAttendant) {
 
      await $.ajax({
         method: 'get',
         url: "../mapa.php",
         data: { rota: 'saveAttendant', jsonValuesAttendant}
      })

   }

   async showAttendants() {

      const res = await $.ajax({
         method: 'get',
         url: "../mapa.php",
         data: { rota: 'attendants'}
      }).then(function (data) {
         return JSON.parse(data)
      })

      return res

   }

   // async deleteCustomers(id) {
   //    await $.ajax({
   //       method: 'get',
   //       url: "../mapa.php",
   //       data: { rota: 'deleteCustomers', id: id }
   //    })

   // }

}





