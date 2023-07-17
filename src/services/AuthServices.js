const login = async (credentials) => {
  try {
    let response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}


const register = async (input) => {
  try {
    let response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(input)
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}


const logout = async () => {
  try {
    let response = await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const updateUser = async (token, data) => {
  try {
    let response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/`+data.name, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Bearer "+token
      },
      body:JSON.stringify(data)
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}


export default {
  register,
  login,
  logout,
  updateUser
}