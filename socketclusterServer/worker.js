var SCWorker = require('socketcluster/scworker');
var fs = require('fs');
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var morgan = require('morgan');
var healthChecker = require('sc-framework-health-check');
var AYLIENTextAPI = require('aylien_textapi');
var baseUrl = "https://api.api.ai/v1/";
var accessToken = "fc52c6c93b0449019961656fb53d37d8";
var reply = "";
var sesId = Math.floor(Math.random()*10000000000);
var apiai = require('apiai');
var dialogapp = apiai(accessToken);
var clientChannel = "";



var textapi = new AYLIENTextAPI({
    application_id: "34d9cc62",
    application_key: "4103e714c6d0e7cd54b0db7163f348c4"
});

var quotes = ["Things work out best for those who make the best of how things work out. ~John Wooden", "To live a creative life, we must lose our fear of being wrong. ~Anonymous", "All our dreams can come true if we have the courage to pursue them. ~Walt Disney", "Just when the caterpillar thought the world was ending, he turned into a butterfly. ~Proverb", "Try not to become a person of success, but rather try to become a person of value. ~Albert Einstein"]
var jokes = ["What is the difference between a snowman and a snowwoman? - Snowballs.", "My dog used to chase people on a bike a lot. It got so bad, finally I had to take his bike away.", "Tonight I dreamt of a beautiful walk on a sandy beach. At least that explains the footprints I found in the cat litter box this morning.", "Of course I should clean my windows. But privacy is important too.", "Smile and the world smiles with you. Fart and the world suddenly stops smiling."]
var videos = ["https://www.youtube.com/watch?v=pTgOLLmTQI0", "https://www.youtube.com/watch?v=Mq0yEI_xpb8", "https://www.youtube.com/watch?v=AnKJfRyj6t0", "https://www.youtube.com/watch?v=o_D11Kt8bo4", "https://www.youtube.com/watch?v=hzBCI13rJmA"]
var songs = ["https://www.youtube.com/watch?v=hT_nvWreIhg&list=PLhGO2bt0EkwvRUioaJMLxrMNhU44lRWg8", "https://www.youtube.com/watch?v=xo1VInw-SKc&list=PLhXQhpqBNAYsiwGQ6e4rxgbQ0gGVfKZ2u", "https://www.youtube.com/watch?v=ru0K8uYEZWw&list=PLNOAkfjgtQtKlODMK8d8PJHuNaQo-OpR4", "https://www.youtube.com/watch?v=LsoLEjrDogU&list=PL4QNnZJr8sRPeLgoOL9t4V-18xRAuqe_f", "https://www.youtube.com/watch?v=NQKC24th90U"]

class Worker extends SCWorker {
  run() {
    console.log('   >> Worker PID:', process.pid);
    var environment = this.options.environment;

    var app = express();

    var httpServer = this.httpServer;
    var scServer = this.scServer;
    var obj = "";
    if (environment == 'dev') {
      app.use(morgan('dev'));
    }
    app.use(serveStatic(path.resolve(__dirname, 'public')));

    // Add GET /health-check express route
    healthChecker.attach(this, app);

    httpServer.on('request', app);

    var count = 0;

    scServer.on('connection', function (socket) {

      socket.on('conn', function (data,res) {
        console.log('Handled sampleClientEvent', data);

        clientChannel = data.uuid;
        if(data.data.includes("joke")){
         var n = Math.floor(Math.random() * (6 - 1) + 1);
                      obj = {ismessage:'true',data:jokes[n], user:'YOMA'};
                      console.log(obj);
                      scServer.exchange.publish(clientChannel, obj); 
        }

        textapi.sentiment({'text': data.data}, function(error, response) {

          if (error === null) {

            console.log(response);

            if(response.polarity == 'negative'){
              console.log("n");
              obj = {ismessage:'false',data:'I think i can cheer you up. I can <br> 1. Show you some of your happy memories 2. Suggest some movies or nearby events <br> 3.Suggest nearby mental health professional <br> 4.Recommend some uplifting songs or  funny videos <br> 4. Tell you some jokes.<br> 5. Show you some motivational quotes'};
              scServer.exchange.publish(clientChannel, obj);
            }
            else{
              if(response.polarity == 'positive'){
                console.log("p");
                obj = {ismessage:'false',data:'I think you are happy and that\'s great! I can <br> 1. Suggest some movies or nearby events <br> 2.Recommend some songs or  funny videos '};
                scServer.exchange.publish(clientChannel, obj);
              }
              else{
                if(response.polarity == 'neutral'){
                  console.log("ne");
                  var request = dialogapp.textRequest(data.data, {
                    sessionId: sesId
                  });
                  request.on('response', function(response) {
                  console.log(response);
                  console.log(response.result.fulfillment.speech);

                  if(response.result.fulfillment.speech == 'songs'){
                    var n = Math.floor(Math.random() * (6 - 1) + 1);
                    obj = {ismessage:'true',data:"<a href = \""+songs[n]+"\">Here are some songs for you</a>", user:'YOMA'};
                    console.log(obj);
                    scServer.exchange.publish(clientChannel, obj);
                  }
                  else{
                    if(response.result.fulfillment.speech == 'jokes'){
                      var n = Math.floor(Math.random() * (6 - 1) + 1);
                      obj = {ismessage:'true',data:jokes[n], user:'YOMA'};
                      console.log(obj);
                      scServer.exchange.publish(clientChannel, obj);
                    }
                    else{
                      if(response.result.fulfillment.speech == 'quotes'){
                        var n = Math.floor(Math.random() * (6 - 1) + 1);
                        obj = {ismessage:'true',data:quotes[n], user:'YOMA'};
                        console.log(obj);
                        scServer.exchange.publish(clientChannel, obj);
                      }
                      else{
                        if(response.result.fulfillment.speech == 'videos'){
                          var n = Math.floor(Math.random() * (6 - 1) + 1);
                          obj = {ismessage:'true',data:"<a href = \""+videos[n]+"\">Here is a video for you</a>", user:'YOMA'};
                          console.log(obj);
                          scServer.exchange.publish(clientChannel, obj);
                        }
                        else{
                         if(response.result.fulfillment.speech == 'movies'){
                            obj = {ismessage:'true',data:"movies"};
                            console.log(obj);
                            scServer.exchange.publish(clientChannel, obj);
                          }
                          else{
                            if(response.result.fulfillment.speech == 'hospitals'){
                              obj = {ismessage:'true',data:"hospitals"};
                              console.log(obj);
                              scServer.exchange.publish(clientChannel, obj);
                            }
                            else{
                              if(response.result.fulfillment.speech == 'events'){
                                  obj = {ismessage:'true',data:"events"};
                                  console.log(obj);
                                  scServer.exchange.publish(clientChannel, obj);
                              }
                              else{
                                if(response.result.fulfillment.speech == 'fun places'){
                                  obj = {ismessage:'true',data:"fun places"};
                                  console.log(obj);
                                  scServer.exchange.publish(clientChannel, obj);
                                }
                                else{
                                  if(response.result.fulfillment.speech == 'images'){
                                    var n = Math.floor(Math.random() * (6 - 1) + 1);
                                    obj = {ismessage:'true',data:"<a href = \"https://scontent.cdninstagram.com/vp/ad06568281bf9a3a399e820815c7038a/5B1DA1B4/t51.2885-15/s640x640/sh0.08/e35/16110394_1048246915287037_7982772150744383488_n.jpg\">Image</a> <a href = \"https://scontent.cdninstagram.com/vp/75e625fd49c370d89a4ebb00b113baea/5B076E09/t51.2885-15/sh0.08/e35/p640x640/16788610_252453208534044_2835513090714370048_n.jpg\">Image</a> <a href = \"https://scontent.cdninstagram.com/vp/a433c4d689ad63eae13968e201338a6c/5B02B9F2/t51.2885-15/s640x640/sh0.08/e35/17662140_691034124402846_2957223749394366464_n.jpg\">Image</a>" , user:'YOMA'};
                                    console.log(obj);
                                    scServer.exchange.publish(clientChannel, obj);
                                  }
                                }

                              }
                            }
                          }
                        }
                      }
                    }
                  }
                });

                request.on('error', function(error) {
                console.log(error);
              });

              request.end();
            }
          }
        }
      }
    });
      });

      socket.on('disconnect', function () {
        clearInterval(interval);
      });

    });
  }
}

new Worker();
