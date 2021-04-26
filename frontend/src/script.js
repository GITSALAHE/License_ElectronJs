const BASE_URL = 'http://localhost:5000/api';

async function checkIsAdmine() {
  var login = document.getElementById('login').value
  var password = document.getElementById('password').value

  axios
  .post(`${BASE_URL}/admine/signIn`, {
      email: login,
      password: password
  })
  .then((response) => {
    if(!response.data.admine.role == 0) {
      alert("access denied resources for admine only")
    }
    else {
      localStorage.setItem("user_id", response.data.admine._id)
      localStorage.setItem("token", response.data.token)
      window.location.href = "admine.ejs"
    }
    })
    .catch(err => {
    if (err.response.data.error) {
      alert(err.response.data.error)
    }
  });
}

async function checkIsConducteur() {
  var login = document.getElementById('login').value
  var password = document.getElementById('password').value

  axios
  .post(`${BASE_URL}/conducteur/signIn`, {
      email: login,
      password: password
  })
  .then((response) => {
    if(!response.data.conducteur.role == 1) {
      alert("access denied resources for conducteur only")
    }
    else {
      localStorage.setItem("conducteur_id", response.data.conducteur._id)
      localStorage.setItem("conducteur_token", response.data.token)
      window.location.href = "conducteur.ejs" 
    }
    })
    .catch(err => {
    if (err.response.data.error) {
      alert(err.response.data.error)
    }
  });
}

async function conducteurReg() {
  var matricule = document.getElementById('matricule').value
  var name = document.getElementById('name').value
  var last_name = document.getElementById('last_name').value
  var email = document.getElementById('email').value
  var telephone = document.getElementById('telephone').value
  var adress = document.getElementById('adress').value
  var numero_du_permis = document.getElementById('numero_du_permis').value
  var password = document.getElementById('password').value
  var confirmPass = document.getElementById('confirmPass').value

  axios
  .post(`${BASE_URL}/conducteur/signUp`, {
    matricule: matricule,
    name: name,
    last_name: last_name,
    email: email,
    telephone: telephone,
    adress: adress,
    numero_du_permis: numero_du_permis,
    password: password,
    confirmPass: confirmPass
  })
  .then((response) => {
      console.log(response.data)
      window.location.href = "conducteurLogin.ejs"
    })
    .catch(err => {
    if (err.response.data.error) {
      alert(err.response.data.error)
    }
  });
}

function selectedConducteur(CIdV) {
  localStorage.setItem('selected', CIdV)
  window.location.href = "conducteurE.ejs"
}

function updateConducteurPoint() {
  var get_token = localStorage.getItem('token')
  var get_user_id = localStorage.getItem('selected')
  var get_admine_id = localStorage.getItem('user_id')

  var data = {
      nombre_du_point: document.getElementById('nombre_du_point').value,
      infractionName: document.getElementById('infraction').value
  }
  axios
  .post(`${BASE_URL}/admine/updateConducteur/${get_admine_id}/${get_user_id}`, 
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${get_token}`
      },
    }
  )
  .then((res) => {
    alert(res.data)
    window.location.href = "admine.ejs"
  }).catch((err) => {
    if (err.response.data.error) {
      alert(err.response.data.error)
    }
  })
}
