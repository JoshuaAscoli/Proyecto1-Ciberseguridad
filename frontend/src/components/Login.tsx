import { useState } from "react";
import "../styles/login.css";

interface Props{
    siguiente:(usuario:string)=>void;
}

function Login({siguiente}:Props){

    const [usuario,setUsuario] = useState("");
    const [error,setError] = useState(false);
    const [bloqueado,setBloqueado] = useState(false);

    const validarUsuario = ()=>{

        if(usuario === "joshuascoli@gmail.com" || usuario === "luismavalle82@gmail.com"){

            siguiente(usuario);

        }else{

            setError(true);
            setBloqueado(true);
            setUsuario("");

            setTimeout(()=>{

                setError(false);
                setBloqueado(false);

            },2000);

        }

    };


    return (

        <div className="login-container">

            <div className="login-card">

                <h1>Login</h1>

                <p>Identificación del usuario</p>

                <div className="input-container">

                    <input
                        className={error ? "input-error" : ""}
                        type="text"
                        placeholder="Correo electrónico"
                        value={usuario}
                        disabled={bloqueado}
                        onChange={(e)=>setUsuario(e.target.value)}
                    />


                </div>

                <button
                    onClick={validarUsuario}
                    disabled={bloqueado}
                >
                    Continuar
                </button>

            </div>

        </div>

    );

}

export default Login;