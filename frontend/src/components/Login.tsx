import { useState } from "react";
import "../styles/login.css";


interface Props{
    siguiente:(usuario:string)=>void;
}


function Login({siguiente}:Props){

    const [usuario,setUsuario] = useState("");


    const validarUsuario = ()=>{

        if(usuario === "joshuascoli@gmail.com"){

            siguiente(usuario);

        }else{

            alert("Usuario no existe");

        }

    };


    return (

        <div className="login-container">

            <div className="login-card">

                <h1>Login Seguro</h1>

                <p>Identificación del usuario</p>

                <input
                    type="text"
                    placeholder="Usuario"
                    value={usuario}
                    onChange={(e)=>setUsuario(e.target.value)}
                />


                <button onClick={validarUsuario}>
                    Continuar
                </button>


            </div>

        </div>

    );

}


export default Login;