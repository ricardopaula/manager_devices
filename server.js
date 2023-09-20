require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');

const ewelink = require('ewelink-api');
const device_id = process.env.DEVICE_ID;

const connection = new ewelink({
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    region: process.env.REGION,
    APP_ID: process.env.APP_ID,
    APP_SECRET: process.env.APP_SECRET,
  });

const config = {
    name: 'manager-devices-app',
    port: 3030,
    host: '0.0.0.0',
};

const app = express();
app.use(express.json())

const logger = log({ console: true, file: false, label: config.name });

app.use(bodyParser.json());
app.use(cors());
app.use(ExpressAPILogMiddleware(logger, { request: true }));

app.get('/on', async (request, response) => {
  try {
    const token = request.query.token

    if (token !== process.env.TOKEN) {
      return response.status(401).json({
        message: 'Token inválido'
      });
    }

    const status = await connection.getDevicePowerState(device_id);

    let message;

    if (status.state === 'off') {
        await connection.toggleDevice(device_id);
        message = 'Ligou';
    } else {
        message = 'Já está ligado';
    }

    response.json({
      message: message
    });
  } catch (error) {
    response.status(500).json({
      message: 'Erro ao processar a requisição'
    });
  }
});

app.get('/off', async (request, response) => {
  try {
    const token = request.query.token

    if (token !== process.env.TOKEN) {
      return response.status(401).json({
        message: 'Token inválido'
      });
    }

    const status = await connection.getDevicePowerState(device_id);

    let message;

    if (status.state === 'on') {
        await connection.toggleDevice(device_id);
        message = 'Desligou';
    } else {
        message = 'Já está desligado';
    }

    response.json({
      message: message
    });
  } catch (error) {
    response.status(500).json({
      message: 'Erro ao processar a requisição'
    });
  }
});

app.listen(config.port, config.host, (e)=> {
    if(e) {
        throw new Error('Internal Server Error');
    }
    logger.info(`${config.name} running on ${config.host}:${config.port}`);
});
