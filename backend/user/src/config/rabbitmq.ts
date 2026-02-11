import ampq from "amqplib"

let channel : ampq.Channel;

export const connectRabbitMQ = async() =>{
    try {
        const connection =await ampq.connect({
            protocol:"amqp",
            hostname:process.env.RABBITMQ_HOST,
            port:5672,
            username:process.env.RABBITMQ_USERNAME,
            password:process.env.RABBITMQ_PASS,
        
        })

        channel = await connection.createChannel();

        console.log("✅ Connect To RabbitMQ")
    } catch (error) {
        console.log("fail to connect to rabbitMQ", error)
    }
}

export const publishToQueue = async(queueName:string, msg:any) => {
    if(!channel){
        console.log("Rabbitmq Channel is not intialized");  
        return;

    }

    await channel.assertQueue(queueName, {durable:true});


    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(msg)),{
        persistent:true
    })
}   