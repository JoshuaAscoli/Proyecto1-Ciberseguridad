import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import "../styles/login.css";


const UMBRAL_SIMILITUD = 0.5;


interface Props {
    usuario: string;
    siguiente: () => void;
}


function Biometria({ usuario, siguiente }: Props) {

    const webcamRef  = useRef<Webcam>(null);
    const canvasRef  = useRef<HTMLCanvasElement>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const [modelosCargados,    setModelosCargados]    = useState(false);
    const [referenciaLista,    setReferenciaLista]    = useState(false);
    const [camaraLista,        setCamaraLista]        = useState(false);
    const [rostroDetectado,    setRostroDetectado]    = useState(false);
    const [esLaPersona,        setEsLaPersona]        = useState(false);
    const [similitud,          setSimilitud]          = useState<number | null>(null);
    const [validando,          setValidando]          = useState(false);
    const [validado,           setValidado]           = useState(false);
    const [errorCamara,        setErrorCamara]        = useState("");
    const [errorReferencia,    setErrorReferencia]    = useState("");

    const descriptorRefRef = useRef<Float32Array | null>(null);


    const nombreFoto = usuario.split("@")[0];


    useEffect(() => {

        const cargar = async () => {

            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
                faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
                faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
            ]);

            setModelosCargados(true);

            const img = new Image();
            img.src = `/known_faces/${nombreFoto}.jpg`;

            img.onload = async () => {

                const intentos = [
                    new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.3 }),
                    new faceapi.TinyFaceDetectorOptions({ inputSize: 608, scoreThreshold: 0.2 }),
                    new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.2 }),
                    new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.1 }),
                ];

                let deteccion = null;

                for (const opciones of intentos) {
                    deteccion = await faceapi
                        .detectSingleFace(img, opciones)
                        .withFaceLandmarks()
                        .withFaceDescriptor();
                    if (deteccion) break;
                }

                if (deteccion) {
                    descriptorRefRef.current = deteccion.descriptor;
                    setReferenciaLista(true);
                } else {
                    setErrorReferencia("No se detectó cara en la foto de referencia. Usa una foto frontal con buena iluminación.");
                }

            };

            img.onerror = () => {
                setErrorReferencia(`No se encontró la foto: /known_faces/${nombreFoto}.jpg`);
            };

        };

        cargar();

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };

    }, [nombreFoto]);


    useEffect(() => {

        if (!modelosCargados || !camaraLista || !referenciaLista) return;

        intervalRef.current = setInterval(async () => {

            const video  = webcamRef.current?.video;
            const canvas = canvasRef.current;

            if (!video || !canvas || video.readyState < 2) return;

            const deteccion = await faceapi
                .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
                .withFaceLandmarks()
                .withFaceDescriptor();

            const dims = faceapi.matchDimensions(canvas, video, true);
            const ctx  = canvas.getContext("2d");

            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (!deteccion) {
                setRostroDetectado(false);
                setEsLaPersona(false);
                setSimilitud(null);
                return;
            }

            setRostroDetectado(true);

            const distancia   = faceapi.euclideanDistance(descriptorRefRef.current!, deteccion.descriptor);
            const porcentaje  = Math.max(0, Math.round((1 - distancia) * 100));
            const coincide    = distancia < UMBRAL_SIMILITUD;

            setSimilitud(porcentaje);
            setEsLaPersona(coincide);

            if (ctx) {

                const redimensionada = faceapi.resizeResults(deteccion, dims);
                const { x, y, width, height } = redimensionada.box;
                const color = coincide ? "#4ade80" : "#f87171";

                ctx.strokeStyle    = color;
                ctx.lineWidth      = 3;
                ctx.shadowColor    = color;
                ctx.shadowBlur     = 10;
                ctx.strokeRect(x, y, width, height);

                ctx.shadowBlur  = 0;
                ctx.fillStyle   = color;
                ctx.font        = "bold 13px sans-serif";
                ctx.fillText(
                    coincide ? `✓ ${porcentaje}% — Coincide` : `✗ ${porcentaje}% — No coincide`,
                    x,
                    y > 20 ? y - 8 : y + height + 18
                );

            }

        }, 400);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };

    }, [modelosCargados, camaraLista, referenciaLista]);


    const verificarRostro = () => {

        setValidando(true);

        if (intervalRef.current) clearInterval(intervalRef.current);

        setTimeout(() => {
            setValidando(false);
            setValidado(true);
            setTimeout(() => siguiente(), 1200);
        }, 1500);

    };


    const estadoTexto = (): { text: string; color: string } => {

        if (errorReferencia)                    return { text: "⚠️ " + errorReferencia,       color: "#f87171" };
        if (!modelosCargados)                   return { text: "⏳ Cargando modelos de IA...", color: "#f59e0b" };
        if (!referenciaLista && !errorReferencia) return { text: "📂 Procesando referencia...", color: "#f59e0b" };
        if (!camaraLista)                       return { text: "📷 Iniciando cámara...",       color: "#f59e0b" };
        if (validado)                           return { text: "✅ Identidad confirmada",       color: "#4ade80" };
        if (validando)                          return { text: "Analizando identidad...",    color: "#60a5fa" };
        if (!rostroDetectado)                   return { text: " Buscando rostro...",         color: "#f59e0b" };
        if (esLaPersona)                        return { text: `✅ Identidad verificada — ${similitud}% de similitud`, color: "#4ade80" };
        return                                         { text: `❌ Persona no reconocida — ${similitud}% de similitud`, color: "#f87171" };

    };

    const { text, color } = estadoTexto();

    const puedeValidar = referenciaLista && rostroDetectado && esLaPersona && !validando && !validado && !errorReferencia;


    return (

        <div className="login-container">

            <div className="login-card">

                <h1>Verificación biométrica</h1>

                <p>Coloque su rostro frente a la cámara</p>


                {errorCamara ? (

                    <div style={{
                        width: 350, height: 260,
                        background: "#1a1a2e",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        borderRadius: 8, color: "#f87171",
                        fontSize: 14, padding: 16, textAlign: "center"
                    }}>
                        <span style={{ fontSize: 40, marginBottom: 12 }}>🚫</span>
                        <strong>Cámara no disponible</strong>
                        <span style={{ marginTop: 8, color: "#aaa" }}>{errorCamara}</span>
                    </div>

                ) : (

                    <div style={{ position: "relative", width: 350, height: 260, borderRadius: 8, overflow: "hidden" }}>

                        <Webcam
                            ref={webcamRef}
                            audio={false}
                            width={350}
                            height={260}
                            screenshotFormat="image/jpeg"
                            style={{ display: "block", borderRadius: 8 }}
                            onUserMedia={() => setCamaraLista(true)}
                            onUserMediaError={(err) => {
                                const msg = err instanceof DOMException ? err.message : String(err);
                                setErrorCamara(msg);
                            }}
                        />

                        <canvas
                            ref={canvasRef}
                            style={{
                                position: "absolute", top: 0, left: 0,
                                width: 350, height: 260,
                                pointerEvents: "none"
                            }}
                        />

                    </div>

                )}


                <p style={{ color, fontWeight: "bold", margin: "12px 0 4px", fontSize: 14, textAlign: "center", maxWidth: 350 }}>
                    {text}
                </p>


                {!validado && (

                    <button
                        onClick={verificarRostro}
                        disabled={!puedeValidar}
                        style={!puedeValidar ? { opacity: 0.4, cursor: "not-allowed" } : {}}
                    >
                         Validar identidad
                    </button>

                )}


            </div>

        </div>

    );

}


export default Biometria;
