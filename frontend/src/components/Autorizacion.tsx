import "../styles/login.css";


const ROLES: Record<string, string> = {
    "joshuascoli@gmail.com": "Administrador",
    "luismavalle82@gmail.com": "Usuario"
};


interface Props {
    usuario: string;
    cerrarSesion: () => void;
}


function Autorizacion({ usuario, cerrarSesion }: Props) {

    const rol = ROLES[usuario] ?? "Usuario";
    const esAdmin = rol === "Administrador";


    return (

        <div className="login-container">

            <div className="login-card">

                <div style={{ fontSize: 64, marginBottom: 8 }}>
                    {esAdmin ? "👑" : "✅"}
                </div>

                <h1 style={{ color: esAdmin ? "#f59e0b" : "#4ade80" }}>
                    Acceso autorizado
                </h1>

                <p style={{ fontSize: 20, fontWeight: "bold", marginBottom: 4 }}>
                    Rol: {rol}
                </p>

                <p style={{ color: "#aaa", fontSize: 14, marginBottom: 24 }}>
                    {usuario}
                </p>

                <div style={{
                    background: esAdmin ? "#451a03" : "#052e16",
                    border: `1px solid ${esAdmin ? "#f59e0b" : "#4ade80"}`,
                    borderRadius: 8,
                    padding: "12px 20px",
                    marginBottom: 24,
                    textAlign: "left"
                }}>
                    <p style={{ margin: 0, fontSize: 13, color: "#ccc" }}>
                        <strong>Permisos:</strong>
                    </p>
                    {esAdmin ? (
                        <ul style={{ margin: "8px 0 0 16px", fontSize: 13, color: "#ccc" }}>
                            <li>Gestión de usuarios</li>
                            <li>Acceso a reportes</li>
                            <li>Configuración del sistema</li>
                            <li>Panel de administración</li>
                        </ul>
                    ) : (
                        <ul style={{ margin: "8px 0 0 16px", fontSize: 13, color: "#ccc" }}>
                            <li>Consulta de información</li>
                            <li>Perfil personal</li>
                        </ul>
                    )}
                </div>

                <button
                    onClick={cerrarSesion}
                    style={{ background: "#dc2626" }}
                >
                    🔒 Cerrar sesión
                </button>

            </div>

        </div>

    );

}


export default Autorizacion;
