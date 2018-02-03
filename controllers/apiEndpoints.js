exports.googleVision = function(req, res) {
  const vision = require('@google-cloud/vision');

  var image = '/Users/GrayShadow/Documents/emot/Resources/myDP.jpg';

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: '/Users/GrayShadow/Documents/emot/emot-bd1bbb7c4647.json'
  });
  
  client
    .faceDetection(image)
    .then(results => {
      const faces = results[0].faceAnnotations;

      console.log('Faces:');
      faces.forEach((face, i) => {
        console.log(`  Face #${i + 1}:`);
        console.log(`    Joy: ${face.joyLikelihood}`);
        console.log(`    Anger: ${face.angerLikelihood}`);
        console.log(`    Sorrow: ${face.sorrowLikelihood}`);
        console.log(`    Surprise: ${face.surpriseLikelihood}`);
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  }