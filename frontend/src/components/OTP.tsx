import { useState } from "react";
import "../styles/login.css";

interface Props{
    usuario: string;
    siguiente:()=>void;
}

function OTP({usuario, siguiente}:Props){

    const [codigo,setCodigo] = useState("");

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

                alert("OTP correcto");
                siguiente();

            }else{

                alert("Código incorrecto");

            }


        }catch(error){

            console.log(error);

        }

    };


    return(

        <div className="login-container">

            <div className="login-card">

                <h1>📩 Verificación OTP</h1>

                <p>
                    Se envió un código a:
                </p>

                <strong>
                    {usuario}
                </strong>


                <input
                    type="text"
                    placeholder="Ingrese código"
                    maxLength={6}
                    value={codigo}
                    onChange={(e)=>setCodigo(e.target.value)}
                />


                <button onClick={validarOTP}>
                    Verificar código
                </button>


            </div>

        </div>

    );

}

export default OTP;