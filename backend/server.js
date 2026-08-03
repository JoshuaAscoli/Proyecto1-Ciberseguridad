require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

let codigoGenerado = "";

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD_APP
    }
});

app.get("/", (req,res)=>{
    res.send("Servidor funcionando");
});

app.post("/enviar-otp", async(req,res)=>{

    const {email} = req.body;

    codigoGenerado = Math.floor(100000 + Math.random()*900000);

    try{

        await transporter.sendMail({
            from:process.env.EMAIL,
            to: email,
            subject:"Código de autenticación",
            text:`Tu código OTP es: ${codigoGenerado}`
        });

        console.log("Código enviado:", codigoGenerado);

        res.json({
            mensaje:"OTP enviado correctamente"
        });

    }catch(error){

        console.log(error);

        res.status(500).json({
            mensaje:"Error enviando correo"
        });

    }

});

app.post("/validar-otp",(req,res)=>{

    const {codigo} = req.body;

    console.log("================================");
    console.log("OTP recibido:", codigo);
    console.log("OTP guardado:", codigoGenerado);
    console.log("================================");


    if(String(codigo) === String(codigoGenerado)){

        res.json({
            valido:true
        });

    }else{

        res.json({
            valido:false
        });

    }

});

app.listen(3000,()=>{
    console.log("Servidor iniciado en puerto 3000");
});