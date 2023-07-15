const listSupplier = async (credentials) => {
  try {
    let response = await fetch(`${import.meta.env.VITE_API_URL}/api/supplier`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer + ' + credentials
      },
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const create = async (data, credentials) => {
  try {
    let response = await fetch(`${import.meta.env.VITE_API_URL}/api/supplier`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer + ' + credentials
      },
      body: JSON.stringify(data)
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

export default {
  listSupplier,
  create
}