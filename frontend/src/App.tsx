import { useState } from "react";
import Login from "./components/Login";
import PIN from "./components/Pin";
import OTP from "./components/OTP";
import Biometria from "./components/Biometria";


function App(){

  const [pantalla, setPantalla] = useState("login");
  const [usuario, setUsuario] = useState("");


  const enviarOTP = async()=>{

    try{

      const respuesta = await fetch(
        "http://localhost:3000/enviar-otp",
        {
          method:"POST"
        }
      );


      const datos = await respuesta.json();

      console.log(datos.mensaje);


    }catch(error){

      console.log(error);

    }

  };


  return (

    <>

      {

        pantalla === "login" ?

        <Login

          siguiente={(user:string)=>{

            setUsuario(user);
            setPantalla("pin");

          }}

        />


        :


        pantalla === "pin" ?

        <PIN

          usuario={usuario}

          siguiente={()=>{

            enviarOTP();

            setPantalla("otp");

          }}

        />


        :


        pantalla === "otp" ?

        <OTP

          siguiente={()=>{

            setPantalla("biometria");

          }}

        />


        :


        <Biometria

          siguiente={()=>{

            setPantalla("autorizacion");

          }}

        />

      }


    </>

  );

}


export default App;