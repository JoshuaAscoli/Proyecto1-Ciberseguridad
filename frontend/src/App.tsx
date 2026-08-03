import { useState } from "react";
import Login from "./components/Login";
import PIN from "./components/Pin";
import OTP from "./components/OTP";
import Biometria from "./components/Biometria";
import Autorizacion from "./components/Autorizacion";


function App(){

  const [pantalla, setPantalla] = useState("login");
  const [usuario, setUsuario] = useState("");

  const cerrarSesion = ()=>{

    setUsuario("");

    setPantalla("login");

};


  const enviarOTP = async()=>{

    try{

      const respuesta = await fetch(
        "http://localhost:3000/enviar-otp",
        {
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({ email: usuario })
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
          cerrarSesion={cerrarSesion}

          siguiente={()=>{

            enviarOTP();

            setPantalla("otp");

          }}

        />


        :


        pantalla === "otp" ?

        <OTP

          usuario={usuario}
          cerrarSesion={cerrarSesion}

          siguiente={()=>{

            setPantalla("biometria");

          }}

        />


        :


        pantalla === "biometria" ?

        <Biometria

          usuario={usuario}

          siguiente={()=>{

            setPantalla("autorizacion");

          }}

        />


        :


        <Autorizacion

          usuario={usuario}

          cerrarSesion={cerrarSesion}

        />

      }


    </>

  );

}


export default App;