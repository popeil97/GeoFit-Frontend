import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  squareCropImage(base64Str){
    /*
    Crops Base64 images to prevent squashing
    */
    var img = new Image();
    img.src = base64Str;
    var canvas = document.createElement('canvas');
    var width = img.width;
    var height = img.height;

    console.log("Original width: ", width);
    console.log("Original height: ", height);

    var sX = 0; 
    var sY = 0;
    var sWidth = width;
    var sHeight = height;

    canvas.width = width;
    canvas.height = height;

    if (width > height) {
      sWidth = height;
      sX = (width - sWidth) / 2;
      canvas.width = sWidth;
    } 
    else {
      sHeight = width;
      sY = (height - sHeight) / 2;
      canvas.height = sHeight;
    }

    console.log("sWidth width: ", sWidth);
    console.log("sHeight height: ", sHeight);
    console.log("sX : ", sX);
    console.log("sY: ", sY);
    
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, sX, sY, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL();
  }

  resizeImage(base64Str, MAX_HEIGHT, MAX_WIDTH) {
    /*
    Resizes Base64 images to ensure smooth upload to Django
    */
    var img = new Image();
    img.src = base64Str;
    var canvas = document.createElement('canvas');
    var width = img.width;
    var height = img.height;

    if (width < MAX_WIDTH && height < MAX_HEIGHT){
      return base64Str;
    }

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL();
  }
  
}


