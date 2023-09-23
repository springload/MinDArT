function eraseDrawing() {


  if (eraserVersion) {

    paintLayer.noStroke();
    paintLayer.strokeWeight(45);
    paintLayer.stroke(255,255,255,125);
    paintLayer.line(mouseX, mouseY, pmouseX, pmouseY);

        }

        else {
          traceLayer.blendMode(BLEND);
          traceLayer.strokeWeight(45);
          traceLayer.stroke(255,0,0,0.4);
          traceLayer.line(mouseX, mouseY, pmouseX, pmouseY);
          traceLayer.blendMode(LIGHTEST);

              }



      }
