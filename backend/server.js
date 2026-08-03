require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());


let codigoGenerado = "";
let usuarioActual = "";

let intentosPIN = 0;
let intentosOTP = 0;



// Cuenta Joshua
const transporterJoshua = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_JOSHUA,
        pass:process.env.PASSWORD_APP_JOSHUA
    }
});


// Cuenta Luis
const transporterLuis = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_LUIS,
        pass:process.env.PASSWORD_APP_LUIS
    }
});



// Alerta administrador
async function enviarAlerta(email, etapa){

    await transporterJoshua.sendMail({

        from:process.env.EMAIL_JOSHUA,

        to:process.env.EMAIL_JOSHUA,

        subject:"🚨 Alerta de seguridad MFA",

        text:
`Alerta de seguridad.

Usuario:
${email}

Se detectaron 3 intentos fallidos en:
${etapa}

Revisar actividad.`

    });

}



app.get("/",(req,res)=>{

    res.send("Servidor funcionando");

});




// =============================
// VALIDAR PIN
// =============================

app.post("/validar-pin", async(req,res)=>{


    const {pin,email}=req.body;


    usuarioActual=email;


    let pinCorrecto="";



    if(email === process.env.EMAIL_JOSHUA){

        pinCorrecto="1112";


    }else if(email === process.env.EMAIL_LUIS){

        pinCorrecto="1234";


    }else{


        return res.json({

            valido:false

        });


    }



    console.log("-------------------");
    console.log("Usuario:",email);
    console.log("PIN:",pin);
    console.log("-------------------");



    if(pin === pinCorrecto){


        intentosPIN=0;


        return res.json({

            valido:true

        });



    }else{


        intentosPIN++;


        console.log(
            "Intento PIN:",
            intentosPIN
        );



        // SOLO AL TERCER INTENTO
        if(intentosPIN === 3){


            await enviarAlerta(
                usuarioActual,
                "PIN"
            );


            intentosPIN=0;


            return res.json({

                valido:false,

                cerrarSesion:true

            });


        }



        // Primer y segundo intento
        return res.json({

            valido:false

        });


    }


});






// =============================
// ENVIAR OTP
// =============================

app.post("/enviar-otp", async(req,res)=>{


    const {email}=req.body;


    usuarioActual=email;


    intentosOTP=0;


    codigoGenerado =
    Math.floor(
        100000 + Math.random()*900000
    );



    let transporter;
    let remitente;



    if(email === process.env.EMAIL_JOSHUA){


        transporter=transporterJoshua;

        remitente=process.env.EMAIL_JOSHUA;



    }else if(email === process.env.EMAIL_LUIS){


        transporter=transporterLuis;

        remitente=process.env.EMAIL_LUIS;



    }else{


        return res.status(400).json({

            valido:false

        });


    }



    try{


        await transporter.sendMail({

            from:remitente,

            to:email,

            subject:"Código de autenticación",

            text:
            `Tu código OTP es: ${codigoGenerado}`

        });



        console.log("-------------------");
        console.log("Correo:",email);
        console.log("Código:",codigoGenerado);
        console.log("-------------------");



        res.json({

            enviado:true

        });



    }catch(error){


        console.log(error);


        res.status(500).json({

            enviado:false

        });


    }


});






// =============================
// VALIDAR OTP
// =============================

app.post("/validar-otp", async(req,res)=>{


    const {codigo}=req.body;



    console.log("-------------------");

    console.log(
        "Ingresado:",
        codigo
    );

    console.log(
        "Correcto:",
        codigoGenerado
    );

    console.log("-------------------");




    if(String(codigo) === String(codigoGenerado)){


        intentosOTP=0;


        return res.json({

            valido:true

        });



    }else{


        intentosOTP++;


        console.log(
            "Intento OTP:",
            intentosOTP
        );



        // SOLO AL TERCER INTENTO
        if(intentosOTP === 3){


            await enviarAlerta(
                usuarioActual,
                "OTP"
            );


            intentosOTP=0;


            return res.json({

                valido:false,

                cerrarSesion:true

            });


        }



        return res.json({

            valido:false

        });


    }


});





app.listen(3000,()=>{

    console.log(
        "Servidor iniciado en puerto 3000"
    );

});