import { useState } from "react";
import "../styles/login.css";

interface Props{
    usuario: string;
    siguiente:()=>void;
    cerrarSesion:()=>void;
}

function OTP({usuario, siguiente, cerrarSesion}:Props){

    const [codigo,setCodigo] = useState("");
    const [error,setError] = useState(false);
    const [bloqueado,setBloqueado] = useState(false);


    const validarOTP = async()=>{

        try{

            const respuesta = await fetch(
                "http://localhost:3000/validar-otp",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        codigo: codigo
                    })
                }
            );


            const datos = await respuesta.json();


            if(datos.valido){

                siguiente();

            }else{
                if(datos.cerrarSesion){

        cerrarSesion();
        return;

    }

                setError(true);
                setBloqueado(true);
                setCodigo("");

                setTimeout(()=>{

                    setError(false);
                    setBloqueado(false);

                },2000);

            }


        }catch(error){

            console.log(error);

        }

    };


    return(

        <div className="login-container">

            <div className="login-card">

                <h1>Verificación OTP</h1>

                <p>
    Se envió un código a: <strong>{usuario}</strong></p>


                <input
                    className={error ? "input-error" : ""}
                    type="text"
                    placeholder="Ingrese código"
                    maxLength={6}
                    value={codigo}
                    disabled={bloqueado}
                    onChange={(e)=>setCodigo(e.target.value)}
                />


                <button 
                    onClick={validarOTP}
                    disabled={bloqueado}
                >
                    Verificar código
                </button>


            </div>

        </div>

    );

}

export default OTP;