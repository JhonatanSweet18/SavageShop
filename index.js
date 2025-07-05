

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads')); // Hacer la carpeta uploads accesible
app.use(express.urlencoded({ extended: true }));

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Route to handle order submission
app.post('/submit-order', upload.single('receipt'), (req, res) => {
    const { 'player-id': playerId, 'server-id': serverId, 'diamond-package': diamondPackage } = req.body;
    const receiptPath = req.file.path;

    const receiptUrl = `http://localhost:${port}/uploads/${path.basename(receiptPath)}`;

    const orderData = `
"${new Date().toISOString()}";"${playerId}";"${serverId}";"${diamondPackage}";"${receiptUrl}"`;

    fs.appendFile('pedidos.csv', orderData, (err) => {
        if (err) {
            console.error('Error writing to CSV file:', err);
            return res.status(500).send('Error interno del servidor.');
        }
        res.status(200).send('Pedido recibido con éxito.');
    });
});

// Create CSV file with headers if it doesn't exist
const csvFilePath = 'pedidos.csv';
const csvHeaders = 'sep=;\n"Fecha";"ID de Jugador";"Servidor";"Paquete de Diamantes";"URL del Comprobante"';


fs.access(csvFilePath, fs.constants.F_OK, (err) => {
    if (err) {
        fs.writeFile(csvFilePath, csvHeaders, (err) => {
            if (err) {
                console.error('Error creating CSV file:', err);
            }
        });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

