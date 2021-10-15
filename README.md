# TP3 Computacion en la Nube - Lambda/DynamoDB
Alumno: Jonatan Vera
Legajo: 27.903

Ejecutar los siguientes comandos:

1 - npm install

2 - docker network create awslocal

3 - docker run -p 8000:8000 --network awslocal --name dynamodb amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb

4 - En el shell de DynamoDb, ejecutar el código del archivo tabla-envio.txt

5 - sam local start-api --docker-network awslocal


Computacion en la Nube, UTN-FRM, 2021
