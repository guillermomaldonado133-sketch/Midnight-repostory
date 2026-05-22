import "./App.css";
import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import auth from "./auth";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { db } from "./auth";
import { useEffect } from "react";

import {
  collection,
  getDocs,
addDoc,
deleteDoc,
doc,
updateDoc
} from "firebase/firestore";

function App() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(false);
  const [projects, setProjects] = useState([]);
  const [brand, setBrand] = useState("");
const [model, setModel] = useState("");
const [year, setYear] = useState("");
const [price, setPrice] = useState("");
const [image, setImage] = useState("");
const [editingId, setEditingId] = useState(null);
const [search, setSearch] = useState("");
const [category, setCategory] = useState("Todos");
const [selectedCar, setSelectedCar] = useState(null);
const [featuredCar, setFeaturedCar] = useState(null);
const [darkMode, setDarkMode] = useState(true);
const [repos, setRepos] = useState([]);
const [twoFA, setTwoFA] = useState(false);
const [selectedKey, setSelectedKey] = useState("");
const totalCars = projects.length;
const soldCars = projects.filter(
  (project) => project.sold
  
).length;
const totalInventoryValue = projects.reduce(
  (total, project) =>
    total + Number(project.price || 0),
  0
);

  const login = async () => {

    try {

      await signInWithEmailAndPassword(auth, email, password);
console.log("ANTES DE LOAD");

await loadProjects();

console.log("DESPUES DE LOAD");

setTwoFA(true);
    } catch (error) {

      alert(error.message);

    }

  };
  const verify2FA = () => {

  if (selectedKey === "Toyota") {

    setLogged(true);
    setTwoFA(false);

  } else {

    alert("🔒 Llave incorrecta");

  }

};
  const loadProjects = async () => {

  console.log("LOAD PROJECTS FUNCIONA");

  const querySnapshot = await getDocs(
    collection(db, "cars")
  );

  const data = [];

  querySnapshot.forEach((doc) => {

    data.push({
      id: doc.id,
      ...doc.data()
    });

  });


  setProjects(data);
  console.log(querySnapshot.size);
  console.log(data);
  if (data.length > 0) {
  setFeaturedCar(data[0]);
}

};
const loadGithubRepos = async () => {

  const response = await fetch(
    "https://api.github.com/users/guillermomaldonado133-sketch/repos"
  );

  const data = await response.json();

  setRepos(data);

};

const addCar = async () => {

  await addDoc(collection(db, "cars"), {

    brand,
    model,
    year,
    price,
    image

  });

  setBrand("");
  setModel("");
  setYear("");
  setPrice("");
  setImage("");

  loadProjects();

};
const updateCar = async () => {

  await updateDoc(doc(db, "cars", editingId), {

    brand,
    model,
    year,
    price,
    image

  });

  setEditingId(null);

  loadProjects();

};
const toggleFavorite = async (project) => {

  await updateDoc(doc(db, "cars", project.id), {

    favorite: !project.favorite

  });

  loadProjects();

};
const toggleSold = async (project) => {

  await updateDoc(doc(db, "cars", project.id), {

    sold: !project.sold

  });

  loadProjects();

};
const deleteCar = async (id) => {

  await deleteDoc(doc(db, "cars", id));

  loadProjects();

};
  const logout = async () => {

    await signOut(auth);

    setLogged(false);

  };
  useEffect(() => {

  loadGithubRepos();

}, []);

if (twoFA) {

  return (

    <div className="container">

      <div className="hero">

        <h1>
          🔑 Segundo Factor
        </h1>

        <p>
          Selecciona la llave correcta para acceder al concesionario.
        </p>

        <h2>
          Vehículo Destacado
        </h2>

        <h3>
          Toyota Supra MK4
        </h3>

       <div
  className="key-card"
  onClick={() => setSelectedKey("Toyota")}
>

  <img
    src="https://nightrungarage.com/cdn/shop/files/7546A01B-B6F9-437B-94A9-5FC1905F3E9A_1200x1200.jpg?v=1717527016"
    alt="Toyota"
  />

  

</div>

        <div
  className="key-card"
  onClick={() => setSelectedKey("Mazda")}
>

  <img
    src="https://i.ebayimg.com/images/g/deMAAOSwTIpgvNFv/s-l1200.webp"
    alt="Mazda"
  />

  

</div>

        <div
  className="key-card"
  onClick={() => setSelectedKey("BMW")}
>

  <img
    src="https://www.reparamandos.com/wp-content/uploads/2017/02/Llave_Mando_a_Distancia_-_BMW_-_E46_.jpg"
    alt="BMW"
  />

  

</div>

        <div
  className="key-card"
  onClick={() => setSelectedKey("Nissan")}
>

  <img
    src="https://cdn11.bigcommerce.com/s-pqcfaolm7q/images/stencil/original/products/2925/2372/H0564-AA410-Nissan-Skyline-R34-GTR-Key-Blank-with-Transponder-from-DYNOSTY__94929.1745956305.jpg"
    alt="Nissan"
  />

 

</div>

        <br /><br />

        <button
          onClick={verify2FA}
        >
          Verificar
        </button>

      </div>

    </div>

  );

}
  if (logged) {

    return (

      <div className={darkMode ? "container dark" : "container"}>

        <div className="hero">

          <>
  <nav className="navbar">

    <h2>Midnight Motors</h2>

   <ul>
  <li>Inicio</li>
  <li>Inventario</li>
  <li>Estadísticas</li>
  <li>GitHub</li>
  <li>Admin</li>

  <li>
  <button
    className="theme-btn"
    onClick={() => setDarkMode(!darkMode)}
  >
    {darkMode ? "☀️" : "🌙"}
  </button>
</li>

<li>
    <a
      href="https://github.com/guillermomaldonado133-sketch"
      target="_blank"
    >
      <FaGithub />
    </a>
  </li>

<li>
  <a
    href="https://linkedin.com/"
    target="_blank"
  >
    <FaLinkedin />
  </a>
</li>
</ul>

  </nav>
  <div className="hero">

  <img
    src="https://i.imgur.com/HeIi0wU.png"
    alt="profile"
    className="profile"
  />

  <h1 className="logo-title">
    Midnight Motors
  </h1>

  <h2>Concesionario Premium</h2>

  <p>
    Vehículos deportivos, clásicos y de alto rendimiento.
    Encuentra el auto perfecto para dominar la carretera.
  </p>

  <div className="hero-buttons">

    <button className="explore-btn">
      Explorar Catálogo
    </button>

    <button className="contact-btn">
      Contactar
    </button>

  </div>

  <div className="skills">

    <h3>Marcas Disponibles</h3>

    <div className="skills-grid">

      <div className="skill-card">Toyota</div>
      <div className="skill-card">Mazda</div>
      <div className="skill-card">Nissan</div>
      <div className="skill-card">BMW</div>

    </div>

  </div>
 <div className="dashboard">

  {featuredCar && (
    <div className="featured-car">

      <img
        src={featuredCar.image}
        alt="featured"
      />

      <div className="featured-info">

        <h2>🔥 Vehículo Destacado</h2>

        <h3>
          {featuredCar.brand} {featuredCar.model}
        </h3>

        <p>
          Año: {featuredCar.year}
        </p>

        <h2>
          Q {featuredCar.price}
        </h2>

      </div>

    </div>
  )}

  <div className="dashboard-card">
    <h2>{totalCars}</h2>
    <p>Vehículos</p>
  </div>

  <div className="dashboard-card">
    <h2>{soldCars}</h2>
    <p>Vendidos</p>
  </div>

  <div className="dashboard-card">
    <h2>
      Q {totalInventoryValue.toLocaleString()}
    </h2>
    <p>Valor Inventario</p>
  </div>

  <div className="dashboard-card">
    <h2>24/7</h2>
    <p>Atención</p>
  </div>

</div>
<div className="projects">

        <h2>Vehículos Disponibles</h2>

        <input
  type="text"
  
  placeholder="Buscar vehículo..."
  className="search-input"
  onChange={(e) => setSearch(e.target.value)}
/>
<select
  className="category-select"
  onChange={(e) => setCategory(e.target.value)}
>

  <option>Todos</option>
  <option>Deportivo</option>
  <option>SUV</option>
  <option>Clásico</option>
  <option>Lujo</option>

</select>
        <div className="project-grid">

         {
          projects
.filter((project) => {

  const matchesSearch =

  (project.brand || "")
    .toLowerCase()
    .includes(search.toLowerCase())

  ||

  (project.model || "")
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesCategory =

    category === "Todos"
      ? true
      : project.category === category;

  return matchesSearch && matchesCategory;

})
.map((project, index) => (

    <div className="project-card" key={index}>
      <button
  className="favorite-btn"
  onClick={() => toggleFavorite(project)}
>
  {project.favorite ? "❤️" : "🤍"}
</button>
{
  project.sold && (
    <span className="sold-badge">
      VENDIDO
    </span>
  )
}
      <img
  src={project.image}
  alt="car"
  className="car-image"
/>
<h3>
  {project.brand} {project.model}
</h3>

<p>
  Año: {project.year}
</p>

<span>
  {project.price}
</span>
<button
  className="details-btn"
  onClick={() => setSelectedCar(project)}
>
  Ver Más
</button>
<button
  className="delete-btn"
  onClick={() => deleteCar(project.id)}
>
  Eliminar
</button>
<button
  className="edit-btn"
  onClick={() => {

    setBrand(project.brand);
    setModel(project.model);
    setYear(project.year);
    setPrice(project.price);
    setImage(project.image);

    setEditingId(project.id);

  }}
>
  Editar
</button>
<button
  className="sold-btn"
  onClick={() => toggleSold(project)}
>
  {project.sold ? "Disponible" : "Vendido"}
</button>

    </div>

  ))
}

        </div>

      </div>
{
  selectedCar && (

    <div className="modal-overlay">

      <div className="modal">

        <img
          src={selectedCar.image}
          alt="car"
          className="modal-image"
        />

        <h2>
          {selectedCar.brand} {selectedCar.model}
        </h2>

        <p>
          Año: {selectedCar.year}
        </p>

        <h3>
          {selectedCar.price}
        </h3>

        <button
          className="close-btn"
          onClick={() => setSelectedCar(null)}
        >
          Cerrar
        </button>

      </div>

    </div>

  )
}
<div className="github-section">

  <h2>
    Historial GitHub
  </h2>

  <div className="github-grid">

    {
      repos.slice(0, 6).map((repo) => (

        <div
          className="github-card"
          key={repo.id}
        >

          <h3>
            {repo.name}
          </h3>

          <p>
            ⭐ {repo.stargazers_count}
          </p>

          <a
            href={repo.html_url}
            target="_blank"
          >
            Ver Repositorio
          </a>

        </div>

      ))
    }

  </div>

</div>
  

      <div className="admin-panel">

  <h2>Panel Admin</h2>

 <input
  type="text"
  placeholder="Marca"
  value={brand}
  onChange={(e) => setBrand(e.target.value)}
/>

  <input
  type="text"
  placeholder="Modelo"
  value={model}
  onChange={(e) => setModel(e.target.value)}
/>

<input
  type="text"
  placeholder="Año"
  value={year}
  onChange={(e) => setYear(e.target.value)}
/>

  <input
    type="text"
    placeholder="Precio"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
  />

  <input
    type="text"
    placeholder="URL Imagen"
    value={image}
    onChange={(e) => setImage(e.target.value)}
  />

 {
  editingId ? (

    <button onClick={updateCar}>
      Guardar Cambios
    </button>

  ) : (

    <button onClick={addCar}>
      Agregar Carro
    </button>

  )
}

      

  

      <button onClick={logout}>
        Cerrar Sesión
      </button>
      <footer className="footer">

  <h2>Midnight Motors</h2>

  <p>
    Premium Car Dealership Experience
  </p>

  <div className="footer-icons">

    <a
      href="https://github.com/"
      target="_blank"
    >
      <FaGithub />
    </a>

    <a
      href="https://linkedin.com/"
      target="_blank"
    >
      <FaLinkedin />
    </a>

  </div>

  <span>
    © 2026 Midnight Motors
  </span>

</footer>

    </div>

  </div>
</>

        </div>

      </div>

    );

  }

  return (

    <div className="container">

      <div className="hero">

        <h1>Login Portfolio</h1>

        <input
          type="email"
          placeholder="Correo"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>
          Iniciar Sesión
        </button>

      </div>

    </div>

  );

}

export default App;
