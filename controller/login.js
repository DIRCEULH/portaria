const loginValidate = async () => {

    const user = $('#user').val()
    const password = $('#password').val()

    const jsonValuesUsers  = {user, password}

    const users = new LoginService();

    await users.login(jsonValuesUsers)

}


  





 


