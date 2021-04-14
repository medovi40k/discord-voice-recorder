const fs = require('fs');
// at the top of your file
// inside a command, event listener, etc.
const Discord = require('discord.js');
const startEmb = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Record')
    .setURL('http://teaparty-mc.tk')
    .setAuthor('Recording shit', 'https://avatarko.ru/img/kartinka/9/igra_multfilm_minion_Hitman_8973.jpg', 'http://teaparty-mc.tk')
    .setDescription('Bot started recording')
    .setThumbnail('https://avatarko.ru/img/kartinka/9/igra_multfilm_minion_Hitman_8973.jpg')
const stopEmb = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Record')
    .setURL('http://teaparty-mc.tk')
    .setAuthor('Recording shit', 'https://avatarko.ru/img/kartinka/9/igra_multfilm_minion_Hitman_8973.jpg', 'http://teaparty-mc.tk')
    .setDescription('Bot stoped recording')
    .setThumbnail('https://avatarko.ru/img/kartinka/9/igra_multfilm_minion_Hitman_8973.jpg')

let connected = 0;
exports.con = function(msg, channelName) {
    let chat = '831959905484537926'

    const voiceChannel = msg.guild.channels.cache.find(channel => channel.id === chat);

    if (!voiceChannel || voiceChannel.type !== 'voice')
        return msg.reply(`The channel #${channelName} doesn't exist or isn't a voice channel.`);
    if(connected == 1){
       console.log(`Bot already joined`);
       return;
    } else{
        connected = 1;
    }
    msg.reply(startEmb);
    console.log(`Sliding into ${voiceChannel.name} ...`);
    voiceChannel.join()
        .then(conn => {


            const dispatcher = conn.play(__dirname + '/../sounds/drop.mp3');
            dispatcher.on('finish', () => { console.log(`Joined ${voiceChannel.name}!\n\nREADY TO RECORD\n`); });
            msg.client.user.setPresence({ activity: { name: `Записывает в ${voiceChannel.name}` }, status: "idle" });

            const receiver = conn.receiver;
            conn.on('speaking', (user, speaking) => {
                if (speaking) {
                    var d = new Date();
                    const createNewChunk = () => {
                        const pathToFile = __dirname + `/../recordings/${user.id}_${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.pcm`;
                        return fs.createWriteStream(pathToFile);
                    };

                    const audioStream = receiver.createStream(user, { mode: 'pcm' });
                    audioStream.pipe(createNewChunk());
                }
            });
        })
        .catch(err => { throw err; });
}

exports.enter = function(msg, channelName) {

    const voiceChannel = msg.guild.channels.cache.find(channel => channel.name === channelName);

    if (!voiceChannel || voiceChannel.type !== 'voice')
        return msg.reply(`The channel #${channelName} doesn't exist or isn't a voice channel.`);
    if(connected == 1){
       console.log(`Bot already joined`);
       return;
    } else{
        connected = 1;
    }
    msg.reply(startEmb);
    console.log(`Sliding into ${voiceChannel.name} ...`);
    voiceChannel.join()
        .then(conn => {


            const dispatcher = conn.play(__dirname + '/../sounds/drop.mp3');
            dispatcher.on('finish', () => { console.log(`Joined ${voiceChannel.name}!\n\nREADY TO RECORD\n`); });
            msg.client.user.setPresence({ activity: { name: `Записывает в ${voiceChannel.name}` }, status: "idle" });

            const receiver = conn.receiver;
            conn.on('speaking', (user, speaking) => {
                if (speaking) {
                    var d = new Date();
                    const createNewChunk = () => {
                        const pathToFile = __dirname + `/../recordings/${user.id}_${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.pcm`;
                        return fs.createWriteStream(pathToFile);
                    };

                    const audioStream = receiver.createStream(user, { mode: 'pcm' });
                    audioStream.pipe(createNewChunk());

                }
            });
        })
        .catch(err => { throw err; });
}

exports.exit = function (msg) {
    // Use optional chaining when we upgrade to Node 14.
    if (
        !(
            msg &&
            msg.guild &&
            msg.guild.voice &&
            msg.guild.voice.channel &&
            msg.guild.voice.connection
        )
    )
        return;
    msg.reply(stopEmb);
    const { channel: voiceChannel, connection: conn } = msg.guild.voice;
    const dispatcher = conn.play(__dirname + "/../sounds/badumtss.mp3", { volume: 0.45 });
    connected = 0;
    dispatcher.on("finish", () => {
        voiceChannel.leave();
        console.log(`\nSTOPPED RECORDING\n`);
        msg.client.user.setPresence({ activity: { name: `Ждет вашей команды!` }, status: "idle" });
    });
};

exports.discon = function (msg) {

    // Use optional chaining when we upgrade to Node 14.
    if (
        !(
            msg &&
            msg.guild &&
            msg.guild.voice &&
            msg.guild.voice.channel &&
            msg.guild.voice.connection
        )
    )
        return;
    msg.reply(stopEmb);
    const { channel: voiceChannel, connection: conn } = msg.guild.voice;
    const dispatcher = conn.play(__dirname + "/../sounds/badumtss.mp3", { volume: 0.45 });
    connected = 0;
    dispatcher.on("finish", () => {
        voiceChannel.leave();
        console.log(`\nSTOPPED RECORDING\n`);
        msg.client.user.setPresence({ activity: { name: `Ждет вашей команды!` }, status: "idle" });
    });
};