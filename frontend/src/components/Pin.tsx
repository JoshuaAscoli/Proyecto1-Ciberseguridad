import { useState } from "react";
import "../styles/login.css";

interface Props {
    usuario:string;
    siguiente:()=>void;
}


function PIN({usuario, siguiente}:Props){

    const [pin,setPin] = useState("");


    const validarPIN = ()=>{

        console.log("Usuario recibido:", usuario);
        console.log("PIN ingresado:", pin);


        if(
            (usuario==="joshuascoli@gmail.com" && pin==="1112") ||
            (usuario==="luismavalle82@gmail.com" && pin==="1234")
        ){

            alert("PIN correcto");
            siguiente();

        }else{

            alert("PIN incorrecto");

        }

    }


    return(

        <div className="login-container">

            <div className="login-card">

                <h1>Validación PIN</h1>

                <p>
                    Usuario: {usuario}
                </p>


                <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="Ingrese PIN"
                    value={pin}
                    onChange={(e)=>setPin(e.target.value)}
                />


                <button onClick={validarPIN}>
                    Continuar
                </button>


            </div>

        </div>

    );

}


export default PIN;