const { nanoid } = require('nanoid');
var AWS = require('aws-sdk');

var  handler = async ({path, pathParameters, httpMethod, body }) => {

    var dynamodb = new AWS.DynamoDB({
        apiVersion: '2012-08-10',
        endpoint: 'http://dynamodb:8000',
        region: 'us-west-2',
        credentials: {
            accessKeyId: '2345',
            secretAccessKey: '2345'
        }
    });

    var docClient = new AWS.DynamoDB.DocumentClient({
        apiVersion: '2012-08-10',
        service: dynamodb
    });
    
    console.log("entra...")
    
    switch (httpMethod) {
        case 'PUT':
            const idEntrega = (pathParameters || {}).idEntrega || false;
            if (idEntrega) {
            const updateParams = {
                TableName: 'Envio',
                Key: {
                    id: idEntrega
                },
                UpdateExpression: 'REMOVE pendiente',
                ConditionExpression: 'attribute_exists(pendiente)'
            }

            try {
                await docClient.update(updateParams).promise()
                return {
                    statusCode: 200,
                    body: `${idEntrega} Envio Entregado`
                };
            } catch {
                return {
                    statusCode: 500,
                    body: `Error en PUT`
                };
            }
            }else{
                return {body:"no se encuentra id"}
            }
        case 'GET':

            const params = {
                TableName: 'Envio',
                IndexName: 'EnviosPendientesIndex'
            };

            try {
                const envios = await docClient.scan(params).promise()
                return {
                    statusCode: 200,
                    body: JSON.stringify(envios)
                }
            } catch (err) {
                console.log(err)
                return {
                    statusCode: 500,
                    body: 'Error en GET'
                };
            }

        case 'POST':
            const createParams = {
                TableName: 'Envio',
                Item: {
                    id: nanoid(),
                    fechaAlta: new Date().toISOString(),
                    pendiente: new Date().toISOString(),
                    destino: body.destino,
                    email: body.email
                }
            }

            try {
                await docClient.put(createParams).promise()
                return {
                    statusCode: 200,
                    body: JSON.stringify(createParams.Item)
                };
            } catch {
                return {
                    statusCode: 500,
                    body: 'Error en POST'
                };
            }
        default:
            return {
                statusCode: 500,
                body: `Metodo ${httpMethod} no soportado`
            };
    }
}

exports.handler = handler;