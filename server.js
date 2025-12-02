const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const PORT = 3000;

// Configuración de conexión a PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "inventario",
  password: "12345",
  port: 5432
});

app.use(express.static("public"));
app.use(cors());
app.use(express.json());

//const bcrypt = require('bcrypt');

/*app.post("/auth", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
  "SELECT * FROM usuarios WHERE TRIM(LOWER(username)) = LOWER(TRIM($1))",
  [username]
);

    if (result.rows.length === 0) 
      return res.status(401).json({ message: "Usuario no encontrado" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) 
      return res.status(401).json({ message: "Contraseña incorrecta" });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error del servidor" });
  }
});*/

/*async function validarUsuario(username, password) {
  if (!username || !password) return false;
  const result = await pool.query(
    "SELECT * FROM usuarios WHERE LOWER(username) = LOWER($1)",
    [username]
  );
  if (result.rows.length === 0) return false;

  const user = result.rows[0];
  if (!user.password) return false;
  return await bcrypt.compare(password, user.password);
}*/

// ==================== REFERENCIALES ====================

// Obtener todos
app.get("/referenciales", async (req, res) => {
  const result = await pool.query("SELECT * FROM referenciales ORDER BY id ASC");
  res.json(result.rows);
});

// Insertar
app.post("/referenciales", async (req, res) => {
  //const { cq, ubicacion, fecha_intro, fecha_cad, username, password } = req.body;
  const { cq, ubicacion, fecha_intro, fecha_cad } = req.body;

  /*if (!await validarUsuario(username, password)) {
    return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
  }*/

  const result = await pool.query(
    "INSERT INTO referenciales (cq, ubicacion, fecha_intro, fecha_cad) VALUES ($1, $2, $3, $4) RETURNING *",
    [cq, ubicacion, fecha_intro, fecha_cad]
  );

  backupPostgres();

  res.json(result.rows[0]);
});

// Modificar referenciales
app.put("/referenciales/:id", async (req, res) => {
  const { id } = req.params;
  //const { cq, ubicacion, fecha_intro, fecha_cad, username, password } = req.body;
  const { cq, ubicacion, fecha_intro, fecha_cad } = req.body;

  /*if (!await validarUsuario(username, password)) {  // <- IMPORTANTE
    return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
  }*/

  const result = await pool.query(
    "UPDATE referenciales SET cq=$1, ubicacion=$2, fecha_intro=$3, fecha_cad=$4 WHERE id=$5 RETURNING *",
    [cq, ubicacion, fecha_intro, fecha_cad, id]
  );

  backupPostgres();

  res.json(result.rows[0]);
});

// Eliminar
app.delete("/referenciales/:id", async (req, res) => {
  const { id } = req.params;
  //const { username, password } = req.body;

  /*if (!await validarUsuario(username, password)) {
    return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
  }*/

  await pool.query("DELETE FROM referenciales WHERE id=$1", [id]);

  backupPostgres();
  res.json({ message: "Referencial eliminado" });
});

// ==================== LIQUIDOS ====================

// Obtener todos
app.get("/liquidos", async (req, res) => {
  const result = await pool.query("SELECT * FROM liquidos ORDER BY id ASC");
  res.json(result.rows);
});

// Insertar
app.post("/liquidos", async (req, res) => {
  //const { nombre, ubicacion, fecha_intro, fecha_cad, username, password } = req.body;
  const { nombre, ubicacion, fecha_intro, fecha_cad, orr, fecha_reg } = req.body;

  /*if (!await validarUsuario(username, password)) {
    return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
  }*/

  // Debe coincidir el número de columnas y valores
  const result = await pool.query(
    "INSERT INTO liquidos (nombre, ubicacion, fecha_intro, fecha_cad, orr, fecha_reg) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [nombre, ubicacion, fecha_intro, fecha_cad, orr, fecha_reg]
  );

  backupPostgres();

  res.json(result.rows[0]);
});

// Modificar
app.put("/liquidos/:id", async (req, res) => {
  const { id } = req.params;
  //const { nombre, ubicacion, fecha_intro, fecha_cad, username, password } = req.body;
  const { nombre, ubicacion, fecha_intro, fecha_cad, orr, fecha_reg} = req.body;

  /*if (!await validarUsuario(username, password)) {
    return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
  }*/

  const result = await pool.query(
    //"UPDATE liquidos SET nombre=$1, ubicacion=$2, fecha_intro=$3, fecha_cad=$4 WHERE id=$5 RETURNING *",
    "UPDATE liquidos SET nombre=$1, ubicacion=$2, fecha_intro=$3, fecha_cad=$4, orr=$5, fecha_reg=$6 WHERE id=$7 RETURNING *",
    //[nombre, ubicacion, fecha_intro, fecha_cad, id]
    [nombre, ubicacion, fecha_intro, fecha_cad, orr, fecha_reg, id]
  );

  backupPostgres();

  res.json(result.rows[0]);
});

// Eliminar
app.delete("/liquidos/:id", async (req, res) => {
  const { id } = req.params;
  //const { username, password } = req.body;

  /*if (!await validarUsuario(username, password)) {
    return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
  }*/

  await pool.query("DELETE FROM liquidos WHERE id=$1", [id]);

  backupPostgres();

  res.json({ message: "Líquido eliminado" });
});

// Referenciales próximos a caducar en N días
app.get("/referenciales/proximos/:dias", async (req, res) => {
  try {
    const { dias } = req.params;
    const result = await pool.query(
      "SELECT * FROM referenciales WHERE fecha_cad <= NOW() + $1::interval ORDER BY fecha_cad ASC",
      [`${dias} days`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener referenciales próximos a caducar" });
  }
});

// Líquidos próximos a caducar en N días
app.get("/liquidos/proximos/:dias", async (req, res) => {
  try {
    const { dias } = req.params;
    const result = await pool.query(
      "SELECT * FROM liquidos WHERE fecha_cad <= NOW() + $1::interval ORDER BY fecha_cad ASC",
      [`${dias} days`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener líquidos próximos a caducar" });
  }
});

// Buscar referenciales por ubicación
app.get("/referenciales/ubicacion/:ubicacion", async (req, res) => {
  try {
    const ubicacion = req.params.ubicacion;
    const result = await pool.query(
      "SELECT * FROM referenciales WHERE ubicacion ILIKE $1",
      [`%${ubicacion}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al buscar referenciales por ubicación" });
  }
});

// Buscar por ubicación
app.get("/liquidos/ubicacion/:ubicacion", async (req, res) => {
  const ubicacion = req.params.ubicacion;
  const result = await pool.query(
    "SELECT * FROM liquidos WHERE ubicacion ILIKE $1",
    [`%${ubicacion}%`]
  );
  res.json(result.rows);
});

// Por nombre o CQ parcial:
app.get("/referenciales/buscar/:cq", async (req, res) => {
  const cq = req.params.cq;
  const result = await pool.query(
    "SELECT * FROM referenciales WHERE cq ILIKE $1",
    [`%${cq}%`]
  );
  res.json(result.rows);
});

app.get("/liquidos/buscar/:nombre", async (req, res) => {
  const nombre = req.params.nombre;
  const result = await pool.query(
    "SELECT * FROM liquidos WHERE nombre ILIKE $1",
    [`%${nombre}%`]
  );
  res.json(result.rows);
});

// Por rango de fechas (caducidad o introducción):
app.get("/referenciales/rango/:desde/:hasta", async (req, res) => {
  const { desde, hasta } = req.params;
  const result = await pool.query(
    "SELECT * FROM referenciales WHERE fecha_cad BETWEEN $1 AND $2 ORDER BY fecha_cad",
    [desde, hasta]
  );
  res.json(result.rows);
});

// Por rango de fechas (caducidad o introducción) para líquidos
app.get("/liquidos/rango/:desde/:hasta", async (req, res) => {
  try {
    const { desde, hasta } = req.params;
    const result = await pool.query(
      "SELECT * FROM liquidos WHERE fecha_cad BETWEEN $1 AND $2 ORDER BY fecha_cad",
      [desde, hasta]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener líquidos por rango de fechas" });
  }
});

// Cantidad de productos por ubicación:
app.get("/referenciales/conteo/ubicacion", async (req, res) => {
  const result = await pool.query(
    "SELECT ubicacion, COUNT(*) as total FROM referenciales GROUP BY ubicacion"
  );
  res.json(result.rows);
});

// Cantidad de líquidos por ubicación
app.get("/liquidos/conteo/ubicacion", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT ubicacion, COUNT(*) as total FROM liquidos GROUP BY ubicacion"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener conteo de líquidos por ubicación" });
  }
});

// Cantidad total de referenciales próximos a caducar
app.get("/referenciales/conteo/proximos/:dias", async (req, res) => {
  try {
    const { dias } = req.params;
    const result = await pool.query(
      "SELECT COUNT(*) as total FROM referenciales WHERE fecha_cad <= NOW() + $1::interval",
      [`${dias} days`]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener referenciales próximos a caducar" });
  }
});

// Cantidad total de líquidos próximos a caducar
app.get("/liquidos/conteo/proximos/:dias", async (req, res) => {
  try {
    const { dias } = req.params;
    const result = await pool.query(
      "SELECT COUNT(*) as total FROM liquidos WHERE fecha_cad <= NOW() + $1::interval",
      [`${dias} days`]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener líquidos próximos a caducar" });
  }
});

// Ordenar resultados
app.get("/referenciales/orden/fecha/:ascdesc", async (req, res) => {
  const { ascdesc } = req.params;
  const result = await pool.query(
    `SELECT * FROM referenciales ORDER BY fecha_cad ${ascdesc.toUpperCase()}`
  );
  res.json(result.rows);
});

// Filtrar por ubicación y próximos a caducar:
app.get("/referenciales/ubicacion/:ubicacion/proximos/:dias", async (req, res) => {
  const { ubicacion, dias } = req.params;
  const result = await pool.query(
    "SELECT * FROM referenciales WHERE ubicacion ILIKE $1 AND fecha_cad <= NOW() + $2::interval",
    [`%${ubicacion}%`, `${dias} days`]
  );
  res.json(result.rows);
});

// Ordenar líquidos por fecha de caducidad
app.get("/liquidos/orden/fecha/:ascdesc", async (req, res) => {
  try {
    const { ascdesc } = req.params;
    const result = await pool.query(
      `SELECT * FROM liquidos ORDER BY fecha_cad ${ascdesc.toUpperCase()}`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al ordenar líquidos por fecha" });
  }
});

// Filtrar líquidos por ubicación y próximos a caducar
app.get("/liquidos/ubicacion/:ubicacion/proximos/:dias", async (req, res) => {
  try {
    const { ubicacion, dias } = req.params;
    const result = await pool.query(
      "SELECT * FROM liquidos WHERE ubicacion ILIKE $1 AND fecha_cad <= NOW() + $2::interval",
      [`%${ubicacion}%`, `${dias} days`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al filtrar líquidos por ubicación y caducidad" });
  }
});

// ==================== CERRAR PRODUCTOS ====================

// En tu archivo de rutas Node/Express
// Cerrar referencial
app.post("/cerrar_referencial/:id", async (req, res) => {
  const id = req.params.id;
  // Log para verificar que la ruta está siendo alcanzada
  console.log(`Intentando cerrar referencial con ID: ${id}`); 
    try {
      // Actualiza cerrado y fecha_cierre
      await pool.query("UPDATE referenciales SET cerrado = TRUE, fecha_cierre = NOW() WHERE id = $1", [id]);
      backupPostgres();
      res.status(200).json({ message: "Referencial cerrado correctamente" });
    } catch (err) {
      console.error("❌ Error en POST /cerrar_referencial:", err);
      res.status(500).json({ message: "Error al cerrar referencial" });
    }
});

// Cerrar líquido
app.post("/cerrar_liquido/:id", async (req, res) => {
  const id = req.params.id;
  // Log para verificar que la ruta está siendo alcanzada
  console.log(`Intentando cerrar líquido con ID: ${id}`); 
    try {
      // Actualiza cerrado y fecha_cierre
      await pool.query("UPDATE liquidos SET cerrado = TRUE, fecha_cierre = NOW() WHERE id = $1", [id]);
      backupPostgres();
      res.status(200).json({ message: "Líquido cerrado correctamente" });
    } catch (err) {
      console.error("❌ Error en POST /cerrar_liquido:", err);
      res.status(500).json({ message: "Error al cerrar líquido" });
    }
});

// Obtener fecha de cierre de referencial
app.get("/referencial_fecha_cierre/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query("SELECT fecha_cierre FROM referenciales WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Referencial no encontrado" });
    }
    res.json({ fecha_cierre: result.rows[0].fecha_cierre });
  } catch (err) {
    console.error("❌ Error en GET /referencial_fecha_cierre:", err);
    res.status(500).json({ message: "Error al obtener fecha de cierre del referencial" });
  }
});

// Obtener fecha de cierre de líquido
app.get("/liquido_fecha_cierre/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query("SELECT fecha_cierre FROM liquidos WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Líquido no encontrado" });
    }
    res.json({ fecha_cierre: result.rows[0].fecha_cierre });
  } catch (err) {
    console.error("❌ Error en GET /liquido_fecha_cierre:", err);
    res.status(500).json({ message: "Error al obtener fecha de cierre del líquido" });
  }
});

// ==================== OBTENER PRODUCTOS ABIERTOS ====================

// Referenciales abiertos
app.get("/referenciales/abiertos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM referenciales WHERE cerrado = FALSE ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener referenciales abiertos" });
  }
});

// Líquidos abiertos
app.get("/liquidos/abiertos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM liquidos WHERE cerrado = FALSE ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener líquidos abiertos" });
  }
});

// ==================== FILTRAR PRODUCTOS ABIERTOS POR UBICACIÓN ====================

// Referenciales abiertos por ubicación
app.get("/referenciales/abiertos/ubicacion/:ubicacion", async (req, res) => {
  try {
    const ubicacion = req.params.ubicacion;
    const result = await pool.query(
      "SELECT * FROM referenciales WHERE cerrado = FALSE AND ubicacion ILIKE $1 ORDER BY id ASC",
      [`%${ubicacion}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener referenciales abiertos por ubicación" });
  }
});

// Líquidos abiertos por ubicación
app.get("/liquidos/abiertos/ubicacion/:ubicacion", async (req, res) => {
  try {
    const ubicacion = req.params.ubicacion;
    const result = await pool.query(
      "SELECT * FROM liquidos WHERE cerrado = FALSE AND ubicacion ILIKE $1 ORDER BY id ASC",
      [`%${ubicacion}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener líquidos abiertos por ubicación" });
  }
});

// ==================== FILTRAR PRODUCTOS CERRADOS POR UBICACIÓN ====================

// Referenciales cerrados por ubicación
app.get("/referenciales/cerrados/ubicacion/:ubicacion", async (req, res) => {
  try {
    const ubicacion = req.params.ubicacion;
    const result = await pool.query(
      "SELECT * FROM referenciales WHERE cerrado = TRUE AND ubicacion ILIKE $1 ORDER BY fecha_cierre DESC NULLS LAST, id ASC",
      [`%${ubicacion}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener referenciales cerrados por ubicación" });
  }
});

// Líquidos cerrados por ubicación
app.get("/liquidos/cerrados/ubicacion/:ubicacion", async (req, res) => {
  try {
    const ubicacion = req.params.ubicacion;
    const result = await pool.query(
      "SELECT * FROM liquidos WHERE cerrado = TRUE AND ubicacion ILIKE $1 ORDER BY fecha_cierre DESC NULLS LAST, id ASC",
      [`%${ubicacion}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener líquidos cerrados por ubicación" });
  }
});

// ==================== FILTRAR PRODUCTOS ABIERTOS POR NOMBRE O CQ ====================

// Referenciales abiertos por CQ
app.get("/referenciales/abiertos/buscar/:cq", async (req, res) => {
  try {
    const cq = req.params.cq;
    const result = await pool.query(
      "SELECT * FROM referenciales WHERE cerrado = FALSE AND cq ILIKE $1 ORDER BY id ASC",
      [`%${cq}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener referenciales abiertos por CQ" });
  }
});

// Líquidos abiertos por nombre
app.get("/liquidos/abiertos/buscar/:nombre", async (req, res) => {
  try {
    const nombre = req.params.nombre;
    const result = await pool.query(
      "SELECT * FROM liquidos WHERE cerrado = FALSE AND nombre ILIKE $1 ORDER BY id ASC",
      [`%${nombre}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener líquidos abiertos por nombre" });
  }
});

// ==================== FILTRAR PRODUCTOS CERRADOS POR NOMBRE O CQ ====================

// Referenciales cerrados por CQ
app.get("/referenciales/cerrados/buscar/:cq", async (req, res) => {
  try {
    const cq = req.params.cq;
    const result = await pool.query(
      "SELECT * FROM referenciales WHERE cerrado = TRUE AND cq ILIKE $1 ORDER BY fecha_cierre DESC NULLS LAST, id ASC",
      [`%${cq}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener referenciales cerrados por CQ" });
  }
});

// Líquidos cerrados por nombre
app.get("/liquidos/cerrados/buscar/:nombre", async (req, res) => {
  try {
    const nombre = req.params.nombre;
    const result = await pool.query(
      "SELECT * FROM liquidos WHERE cerrado = TRUE AND nombre ILIKE $1 ORDER BY fecha_cierre DESC NULLS LAST, id ASC",
      [`%${nombre}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener líquidos cerrados por nombre" });
  }
});

// ==================== OBTENER PRODUCTOS CERRADOS ====================

// Referenciales cerrados
app.get("/referenciales/cerrados", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM referenciales WHERE cerrado = TRUE ORDER BY fecha_cierre DESC NULLS LAST, id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener referenciales cerrados" });
  }
});

// Líquidos cerrados
app.get("/liquidos/cerrados", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM liquidos WHERE cerrado = TRUE ORDER BY fecha_cierre DESC NULLS LAST, id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener líquidos cerrados" });
  }
});

// ==================== USUARIOS ====================

// Obtener todos los usuarios (sin contraseñas)
/*app.get("/usuarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username FROM usuarios ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});*/

function backupPostgres() {
  const backupFile = path.join(__dirname, "inventario_backup.sql");

  const env = Object.assign({}, process.env, { PGPASSWORD: "12345" });

  const command = `"C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe" -U postgres -h localhost -p 5432 inventario -f "${backupFile}"`;

  exec(command, { env }, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Error haciendo backup:", error);
    } else {
      console.log("✅ Backup realizado en:", backupFile);
    }
  });
}

backupPostgres();

// Backup cada 30 minutos (30*60*1000 ms)
setInterval(backupPostgres, 30 * 60 * 1000);

// ==================== SERVIDOR ====================
const open = require("open");

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  open.default(`http://localhost:${PORT}/inventario.html`);
});
