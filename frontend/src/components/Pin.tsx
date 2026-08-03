import { useState } from "react";
import "../styles/login.css";

interface Props {
    usuario:string;
    siguiente:()=>void;
    cerrarSesion:()=>void;
}


function PIN({usuario, siguiente, cerrarSesion}:Props){

    const [pin,setPin] = useState("");
    const [error,setError] = useState(false);
    



    const validarPIN = async()=>{

        try{


            const respuesta = await fetch(
                "http://localhost:3000/validar-pin",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        pin:pin,
                        email:usuario
                    })
                }
            );



            const data = await respuesta.json();



            if(data.valido){


                siguiente();


            }else{
                if(data.cerrarSesion){

        cerrarSesion();

        return;

    }


                setError(true);

                

                setPin("");



                setTimeout(()=>{

                    setError(false);
                    

                },2000);


            }



        }catch(error){

            console.log(
                "Error conectando backend:",
                error
            );

        }


    };



    return(

        <div className="login-container">

            <div className="login-card">

                <h1>Validación PIN</h1>


                <p>
                    Usuario: {usuario}
                </p>



                <input

                    className={error ? "input-error" : ""}

                    type="password"

                    inputMode="numeric"

                    maxLength={4}

                    placeholder="Ingrese PIN"

                    value={pin}

                    onChange={(e)=>setPin(e.target.value)}

                />



                <button
                    onClick={validarPIN}
                >
                    Continuar
                </button>



                {
                    

                        

                    
                }



            </div>

        </div>

    );

}


export default PIN;