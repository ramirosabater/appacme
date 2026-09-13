const fs = require('fs');
const path = require('path');

// Cargar variables desde .env (sin depender de una libreria externa que no esta instalada).
// El archivo .env vive en la raiz del proyecto (un nivel arriba de src/) y NO se sube a git.
(function loadEnv() {
    const envPath = path.resolve(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
        const lines = fs.readFileSync(envPath, 'utf8').split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const idx = trimmed.indexOf('=');
            if (idx === -1) continue;
            const key = trimmed.slice(0, idx).trim();
            let value = trimmed.slice(idx + 1).trim();
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            if (!(key in process.env)) {
                process.env[key] = value;
            }
        }
    }
})();

const { Pool } = require('pg');
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

const secret = {
    SECRET: process.env.JWT_SECRET,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY
}

// Si falta el .env o las variables, mejor frenar al arrancar que correr con un secret vacio/debil.
if (!secret.SECRET) {
    throw new Error('Falta la variable de entorno JWT_SECRET (revisar el archivo .env en la raiz del proyecto)');
}

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
});

const poolOportunidades = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME_OPORTUNIDADES,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
});


const config = {
    development: {
        mailRRHH: 'fernandoopaez@gmail.com',
        mailTesoreria: 'fernandoopaez@gmail.com',
        mailAdministracion: 'fernandoopaez@gmail.com',
    },
    production: {
        mailRRHH: 'rrhh@acme.com.ar',
        mailTesoreria: 'tesoreria@acme.com.ar',
        mailAdministracion: 'administracion@acme.com.ar',
    },
};

// Definir ambiente actual
const environment = process.env.NODE_ENV || 'production';


module.exports = {
    secret,
    pool,
    config: config[environment],
    poolOportunidades,

}
