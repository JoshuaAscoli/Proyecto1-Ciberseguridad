import { useRef, useState } from "react";
import Webcam from "react-webcam";
import "../styles/login.css";


interface Props{
    siguiente:()=>void;
}


function Biometria({siguiente}:Props){

    const webcamRef = useRef<Webcam>(null);
    const [validado,setValidado] = useState(false);


    const verificarRostro = ()=>{

        setValidado(true);

        alert("Rostro validado correctamente");

        siguiente();

    };


    return(

        <div className="login-container">

            <div className="login-card">

                <h1>
                    📷 Verificación biométrica
                </h1>


                <p>
                    Coloque su rostro frente a la cámara
                </p>


                <div>

                    <Webcam

                        ref={webcamRef}

                        audio={false}

                        width={350}

                        height={260}

                        screenshotFormat="image/jpeg"

                        videoConstraints={{
                            facingMode:"user"
                        }}

                    />

                </div>


                <button onClick={verificarRostro}>
                    🔍 Validar identidad
                </button>


                {
                    validado &&

                    <p>
                        ✅ Rostro confirmado
                    </p>

                }


            </div>

        </div>

    );

}


export default Biometria;