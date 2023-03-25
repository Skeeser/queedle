        var ConversionFunctions = {
			// Output the image as a string for horizontally drawing displays
			horizontal1bit: function (data, canvasWidth, canvasHeight){
			    var output_string = "";
			    var output_index = 0;
			    var byteIndex = 7;
			    var number = 0;
			    // format is RGBA, so move 4 steps per pixel
			    for(var index = 0; index < data.length; index += 4){
				    // Get the average of the RGB (we ignore A)
				    var avg = (data[index] + data[index + 1] + data[index + 2]) / 3;
				    if(avg > settings["threshold"]){
					    number += Math.pow(2, byteIndex);
				    }
				    byteIndex--;
				    // if this was the last pixel of a row or the last pixel of the
				    // image, fill up the rest of our byte with zeros so it always contains 8 bits
				    if ((index != 0 && (((index/4)+1)%(canvasWidth)) == 0 ) || (index == data.length-4)) {
					    byteIndex = -1;
				    }
				    // When we have the complete 8 bits, combine them into a hex value
				    if(byteIndex < 0){
				        var byteSet = number.toString(16);
					    if(byteSet.length == 1){ byteSet = "0"+byteSet; }
					    var b = "0x"+byteSet;
					    output_string += b + ", ";
					    output_index++;
					    if(output_index >= 16){
						    output_string += "\n";
						    output_index = 0;
					    }
						number = 0;
						byteIndex = 7;
					}
				}
				return output_string;
			},
			// Output the image as a string for vertically drawing displays
			vertical1bit: function (data, canvasWidth, canvasHeight){
				var output_string = "";
				var output_index = 0;
				for(var p=0; p < Math.ceil(settings["screenHeight"] / 8); p++){
					for(var x = 0; x < settings["screenWidth"]; x++){
						var byteIndex = 7;
						var number = 0;
						for (var y = 7; y >= 0; y--){
							var index = ((p*8)+y)*(settings["screenWidth"]*4)+x*4;
							var avg = (data[index] + data[index +1] + data[index +2]) / 3;
							if (avg > settings["threshold"]){
								number += Math.pow(2, byteIndex);
							}
							byteIndex--;
						}
						var byteSet = number.toString(16);
						if (byteSet.length == 1){ 
							byteSet = "0"+byteSet; 
						}
						var b = "0x"+byteSet.toString(16);
						output_string += b + ", ";
						output_index++;
						if(output_index >= 16){
							output_string += "\n";
							output_index = 0;
						}
					}
				}
				return output_string;
			},
			// Output the alpha mask as a string for horizontally drawing displays
			horizontalAlpha: function (data, canvasWidth, canvasHeight){
				var output_string = "";
				var output_index = 0;
				var byteIndex = 7;
				var number = 0;
				// format is RGBA, so move 4 steps per pixel
				for(var index = 0; index < data.length; index += 4){
					// Get alpha part of the image data
					var alpha = data[index + 3];
					if(alpha > settings["threshold"]){
						number += Math.pow(2, byteIndex);
					}
					byteIndex--;
					// if this was the last pixel of a row or the last pixel of the
					// image, fill up the rest of our byte with zeros so it always contains 8 bits
					if ((index != 0 && (((index/4)+1)%(canvasWidth)) == 0 ) || (index == data.length-4)) {
						byteIndex = -1;
					}
					// When we have the complete 8 bits, combine them into a hex value
					if(byteIndex < 0){
						var byteSet = number.toString(16);
						if(byteSet.length == 1){ byteSet = "0"+byteSet; }
						var b = "0x"+byteSet;
						output_string += b + ", ";
						output_index++;
						if(output_index >= 16){
							output_string += "\n";
							output_index = 0;
						}
						number = 0;
						byteIndex = 7;
					}
				}
				return output_string;
			}
		};
		// An images collection with helper methods
		function Images() {
			var collection = [];
			this.push = function(img, canvas, glyph) {
				collection.push({ "img" : img, "canvas" : canvas, "glyph" : glyph });
			};
			this.remove = function(image) {
				var i = collection.indexOf(image);
				if(i != -1) collection.splice(i, 1);
			};
			this.each = function(f) { collection.forEach(f); };
			this.length = function() { return collection.length; };
			this.first = function() { return collection[0]; };
			this.last = function() { return collection[collection.length - 1]; };
			this.getByIndex = function(index) { return collection[index]; };
			this.setByIndex = function(index, img) { collection[index] = img; };
			this.get = function(img) {
				if(img) {
					for(var i = 0; i < collection.length; i++) {
						if(collection[i].img == img) {
							return collection[i];
						}
					}
				}
				return collection;
			};
			return this;
		}
		// Add events to the file input button
		var fileInput = document.getElementById("file-input");
		fileInput.addEventListener("click", function(){this.value = null;}, false);
		fileInput.addEventListener("change", handleImageSelection, false);
		// Filetypes accepted by the file picker
		var fileTypes = ["jpg", "jpeg", "png", "bmp", "gif", "svg"];
		// The canvas we will draw on
		var canvasContainer = document.getElementById("images-canvas-container");
		// multiple images settings container
		var imageSizeSettings = document.getElementById("image-size-settings");
		// all images same size button
		var allSameSizeButton = document.getElementById("all-same-size");
		// error message
		var onlyImagesFileError = document.getElementById("only-images-file-error");
		var imgsize = document.getElementById("img-size");
		// initial message
		var noFileSelected = document.getElementById("no-file-selected");
		// The variable to hold our images. Global so we can easily reuse it when the
		// user updates the settings (change canvas size, scale, invert, etc)
		var images = new Images();
		// A bunch of settings used when converting
		var settings = {
			screenWidth: 128,
			screenHeight: 64,
			scaleToFit: true,
			preserveRatio: true,
			centerHorizontally: true,
			centerVertically: true,
			flipHorizontally: false,
			flipVertically: false,
			backgroundColor: "white",
			scale: "1",
			drawMode: "horizontal",
			threshold: 128,
			outputFormat: "plain",
			invertColors: false,
			rotate180: false,
			IC: "UC",
			Size: "0102",
			queding: false,
			conversionFunction: ConversionFunctions.horizontal1bit
		};
		// Variable name, when "arduino code" is required
		var identifier = "myBitmap";
		function update() {
			images.each(function(image) { place_image(image); });
		}
		// Easy way to update settings controlled by a textfield
		function updateInteger(fieldName){
			settings[fieldName] = document.getElementById(fieldName).value;
			update();
		}
		// Easy way to update settings controlled by a checkbox
		function updateBoolean(fieldName){
			settings[fieldName] = document.getElementById(fieldName).checked;
			update();
		}
		// Easy way to update settings controlled by a radiobutton
		function updateRadio(fieldName){
			var radioGroup = document.getElementsByName(fieldName);
			for (var i = 0; i < radioGroup.length; i++) {
				if (radioGroup[i].checked) {
					settings[fieldName] = radioGroup[i].value;
				}
			}
			update();
		}	
		function copy()
		{
			var target=document.getElementById("code-output");
			target.select(); // 选择文本
			document.execCommand("Copy"); // 执行浏览器复制命令
		    alert("Copy completed, can be pasted.");
			
		}
		// Updates Arduino code check-box
		function updateOutputFormat(elm) {
			var caption = document.getElementById("format-caption-container");
			var adafruitGfx = document.getElementById("adafruit-gfx-settings");
			var arduino = document.getElementById("arduino-identifier");
			for(var i = 0; i < caption.children.length; i++) {
				caption.children[i].style.display = "none";
			}
			caption = document.querySelector("div[data-caption='" + elm.value + "']");
			if(caption) caption.style.display = "block";
			elm.value != "plain" ? arduino.style.display = "block" : arduino.style.display = "none";
			elm.value == "adafruit_gfx" ? adafruitGfx.style.display = "block" : adafruitGfx.style.display = "none";
			settings["outputFormat"] = elm.value;
		}
		
		
		//  UC-------垂直扫描，自有至左扫描，颜色反转。
		//  UCM09----垂直扫描，自有至左扫描，颜色反转。
	    //  SSD------垂直扫描，颜色反转。
		//  SSD-152--垂直扫描，颜色反转。
		//  UC1------水平扫描，颜色反转。
		//  SSD1-----水平扫描，自底至顶扫描，颜色反转。
		//  UC2------水平扫描。
        //  UC-583---水平扫描。
		
		
        function IC(elm) {
			
			switch(elm.value){
				case "0102":  // 1.02寸
					var sec = document.getElementById('second');
					sec.options.length=0; //清空二级菜单项
					sec.options[0] = new Option("Please select model","UC");
					sec.options[1] = new Option("GDEW0102T4","UC");
					sec.options[2] = new Option("GDEW0102I3F","UC");
					sec.options[3] = new Option("GDEW0102I4F","UC");
				break;		  
				case "0154":  //1.54寸
					var sec = document.getElementById('second');
					sec.options.length=0; //清空二级菜单项
					sec.options[0] = new Option("Please select model","UC");
					sec.options[1] = new Option("GDEW0154M09","UCM09");
					sec.options[2] = new Option("GDEW0154M10","UC");
					sec.options[3] = new Option("GDEW0154T8(D,J)","UC");	
					sec.options[4] = new Option("GDEW0154I9F(D)","UC");
					sec.options[5] = new Option("GDE(H,M,Y)0154D67","SSD");
					sec.options[6] = new Option("GDEH(M)0154Z90","SSD");
					sec.options[7] = new Option("GDEM0154Z91","SSD-152");
				break;  
				case "0213":  //2.13寸
					var sec = document.getElementById('second');
					sec.options.length=0; //清空二级菜单项
					sec.options[0] = new Option("Please select model","UC");
					sec.options[1] = new Option("GDEH0213B72","SSD");
					sec.options[2] = new Option("GDEH0213B73","SSD");
					sec.options[3] = new Option("GDE(H,M,Y)0213B74","SSD");	
					sec.options[4] = new Option("GDEW0213V7LT","UC");
					sec.options[5] = new Option("GDEW0213T5(D)","UC");
					sec.options[6] = new Option("GDEW0213I5F(D)","UC");
					sec.options[7] = new Option("GDEH0213Z98","SSD");
					sec.options[8] = new Option("GDEH0213Z19","UC");
					sec.options[9] = new Option("GDEW0213M21","UC");
					sec.options[10] = new Option("GDEM0213Z99","SSD");
					sec.options[11] = new Option("GDEQ0213Z21","UC");
				break;	  
				case "026":  //2.6寸
					var sec = document.getElementById('second');
					sec.options.length=0; //清空二级菜单项
					sec.options[0] = new Option("Please select model","UC");
					sec.options[1] = new Option("GDEW026T0(D)","UC");
					sec.options[2] = new Option("GDEW026M01","UC");
					sec.options[3] = new Option("GDEM0266T90","SSD");	
				break;	  
				case "027":  //2.7寸
					var sec = document.getElementById('second');
					sec.options.length=0; //清空二级菜单项
					sec.options[0] = new Option("Please select model","UC");
					sec.options[1] = new Option("GDEW027W3","UC");
					sec.options[2] = new Option("GDEW027C44","UC");
				break;			
				case "029":  //2.7寸
					var sec = document.getElementById('second');
					sec.options.length=0; //清空二级菜单项
					sec.options[0] = new Option("Please select model","UC");
					sec.options[1] = new Option("GDEW029T5(D)","UC");
					sec.options[2] = new Option("GDEW029M06","UC");
					sec.options[3] = new Option("GDE(W,H,Q)029Z13","UC");
					sec.options[4] = new Option("GDE(M,Y)029T94","SSD");
					sec.options[5] = new Option("GDEH029D56LT","SSD");
					sec.options[6] = new Option("GDEH029D57LT","SSD");
					sec.options[7] = new Option("GDEW029I6F(D)","UC");
					sec.options[8] = new Option("GDEW029C32","UC");
					sec.options[9] = new Option("GDEH029Z92","SSD");
					sec.options[10] = new Option("GDEQ029Z21","SSD");
				break;		 
				case "0371":  //2.7寸
					var sec = document.getElementById('second');
					sec.options.length=0; //清空二级菜单项
					sec.options[0] = new Option("Please select model","UC");
					sec.options[1] = new Option("GDEW0371W7","UC");
					sec.options[2] = new Option("GDEW0371Z80","UC");
					sec.options[3] = new Option("GDEH037Z01","UC");
				break;		     
				case "042":  //2.7寸
					var sec = document.getElementById('second');
					sec.options.length=0; //清空二级菜单项
					sec.options[0] = new Option("Please select model","UC1");
					sec.options[1] = new Option("GDEW042T2","UC1");
					sec.options[2] = new Option("GDEW042M01","UC1");
					sec.options[3] = new Option("GDEW042Z15","UC1");
					sec.options[4] = new Option("GDEW042C37","UC1");
					sec.options[5] = new Option("GDE(H,Q)042Z21","UC1");
					sec.options[6] = new Option("GDEH042Z96","SSD1");
					sec.options[7] = new Option("GDE(M,Y)042Z98","SSD1");
					sec.options[8] = new Option("GDEY042T91","SSD1");
				break; 
				case "0583":  //2.7寸
					var sec = document.getElementById('second');
					sec.options.length=0; //清空二级菜单项
					sec.options[0] = new Option("Please select model","UC1");
					sec.options[1] = new Option("GDEW0583T7","UC2");
					sec.options[2] = new Option("GDEW0583T8","UC-583");
					sec.options[3] = new Option("GDEW0583M09","UC-583");
					sec.options[4] = new Option("GDEW0583Z83","UC-583");
					sec.options[5] = new Option("GDEW0583Z21","UC2");
					sec.options[6] = new Option("GDEW0583C64","UC2"); 
				break;  
				case "075":  //2.7寸
					var sec = document.getElementById('second');
					sec.options.length=0; //清空二级菜单项
					sec.options[0] = new Option("Please select model","UC1");
					sec.options[1] = new Option("GDE(W,M,Y)075T7","UC2");
					sec.options[2] = new Option("GDEW075M10","UC2");
					sec.options[3] = new Option("GDE(W,M,Y)075Z08","UC2");
					sec.options[4] = new Option("GDEH075T90","SSD1");
					sec.options[5] = new Option("GDEH075Z90","SSD1");
				break;    
				case "116":  //2.7寸
					var sec = document.getElementById('second');
					sec.options.length=0; //清空二级菜单项
					sec.options[0] = new Option("Please select model","UC1");
					sec.options[1] = new Option("GDEH116T01","SSD1");
					sec.options[2] = new Option("GDEH116Z91","SSD1");						 
				break;			  
				case "1248":  //2.7寸
					var sec = document.getElementById('second');
					sec.options.length=0; //清空二级菜单项
					sec.options[0] = new Option("Please select model","UC1");
					sec.options[1] = new Option("GDEW1248T3","UC2");
					sec.options[2] = new Option("GDEW1248Z95","UC2");
					sec.options[3] = new Option("GDEW1248C63","UC2");				 
				break;  
				case "other":  //2.7寸
					var sec = document.getElementById('second');
					sec.options.length=0; //清空二级菜单项
					sec.options[0] = new Option("Please select model","UC1");
					sec.options[1] = new Option("UC(Under 4.2'')","UC");
					sec.options[2] = new Option("SSD(Under 4.2'')","SSD");
					sec.options[3] = new Option("UC(4.2'')","UC1");		
					sec.options[4] = new Option("SSD(4.2'')","SSD1");	
					sec.options[5] = new Option("UC(Above 4.2'')","UC2");
					sec.options[6] = new Option("SSD(Above 4.2'')","SSD1");	
					sec.options[7] = new Option("GDEW0583(T8,M09,Z83)","UC-583");				
				break;
			}
        }
		
	    function Size(elm) {
			var a= document.getElementById("UC");
			var b = document.getElementById("SSD");
			settings.IC = elm.value;				
		}
		function updateDrawMode(elm) {
			var note = document.getElementById("note1bit");
			if(elm.value == "horizontal1bit" || elm.value == "vertical1bit") {
				note.style.display = "block";
			} else {
				note.style.display = "none";
			}
			var conversionFunction = ConversionFunctions[elm.value];
			if(conversionFunction) {
				settings.conversionFunction = conversionFunction;
			}
		}
		// Make the canvas black and white
		function blackAndWhite(canvas, ctx){
			var imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
			var data = imageData.data;
			for (var i = 0; i < data.length; i += 4) {
				var avg = (data[i] + data[i +1] + data[i +2]) / 3;
				avg > settings["threshold"] ? avg = 255 : avg = 0;
				data[i]     = avg; // red
				data[i + 1] = avg; // green
				data[i + 2] = avg; // blue
			}
			ctx.putImageData(imageData, 0, 0);
		}
		// Invert the colors of the canvas
		function invert(canvas, ctx) {
			var imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
			var data = imageData.data;
			for (var i = 0; i < data.length; i += 4) {
				data[i]     = 255 - data[i];         // red
				data[i + 1] = 255 - data[i + 1];     // green
				data[i + 2] = 255 - data[i + 2];     // blue
			}
			ctx.putImageData(imageData, 0, 0);
		}
		// Draw the image onto the canvas, taking into account color and scaling
		function place_image(image){
			var img = image.img;
			var canvas = image.canvas;
			var ctx = canvas.getContext("2d");
			image.ctx = ctx;
			// Invert background if needed
			if (settings["backgroundColor"] == "transparent") {
				ctx.fillStyle = "rgba(0,0,0,0.0)";
				ctx.globalCompositeOperation = 'copy';
			} else {
				if (settings["invertColors"]){
					settings["backgroundColor"] == "white" ? ctx.fillStyle = "black" : ctx.fillStyle = "white";
				} else {
					ctx.fillStyle = settings["backgroundColor"];
				}
				ctx.globalCompositeOperation = 'source-over';
			}
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.setTransform(1, 0, 0, 1, 0, 0); // start with identity matrix transform (no rotation).
			if(settings["rotate180"]){
			    switch(Modelselection.value){   
				    case "0102":  
				        if(img.width !=128 || img.height !=80){
				            alert("请选择分辨率为128*80的图片,点击确定后重新选择");  
				        	javascript:location.reload();						  
				        }	  
				    break;	   
				    case "0154":  
				    if(second.value == "SSD" || second.value == "UCM09"){
					    if(img.width !=200 || img.height !=200){
						    alert("请选择分辨率为200*200的图片,点击确定后重新选择");  
						    javascript:location.reload();
					    }			     
				    }else{
					    if(img.width !=152 || img.height !=152){
		                    alert("请选择分辨率为152*152的图片,点击确定后重新选择");  	
					        javascript:location.reload();								 
					    }			      
				    }			   
				    break;
				    case "0213":
				    if(second.value == "SSD"){
				   	    if(img.width !=250 || img.height !=122){
				   			alert("请选择分辨率为250*122的图片,点击确定后重新选择");  
				   			javascript:location.reload();
				   		}			  	   					   
				    }else{			   
				   		if(img.width !=212 || img.height !=104){
				            alert("请选择分辨率为212*104的图片,点击确定后重新选择");  	
				   			javascript:location.reload();								  
				   	    }			   					   
				   }		   
				   break;
				   case "026":
				        if(img.width !=296 || img.height !=152){
				        	alert("请选择分辨率为296*152的图片,点击确定后重新选择");  
				        	javascript:location.reload();
				        }	  
				   break;   
				   case "027":
				        if(img.width !=264 || img.height !=176){
				        	alert("请选择分辨率为264*176的图片,点击确定后重新选择");  
				        	javascript:location.reload();
				        }	  
				   break;
				   case "029":
				        if(img.width !=296 || img.height !=128){
				        	alert("请选择分辨率为296*128的图片,点击确定后重新选择");  
				        	javascript:location.reload();
				        }	  
				   break;
				   case "0371":
				        if(img.width !=416 || img.height !=240){
				        	alert("请选择分辨率为416*240的图片,点击确定后重新选择");  
				        	javascript:location.reload();
				        }	  
				   break;
				   case "042":
				        if(img.width !=400 || img.height !=300){
				        	alert("请选择分辨率为400*300的图片,点击确定后重新选择");  
				        	javascript:location.reload();
				        }	  
				   break;
				   case "0583":
				   if(second.value == "UC2"){
				   		if(img.width !=600 || img.height !=448){
				   			alert("请选择分辨率为600*448的图片,点击确定后重新选择");  
				   			javascript:location.reload();
				   		}			   					   
				   }else{				   
				   		if(img.width !=648 || img.height !=480){
				            alert("请选择分辨率为648*480的图片,点击确定后重新选择");  	
				   			javascript:location.reload();								  
				   		}			    					   
				   }  			   
				   break;
				   case "075":
				   if(second.value == "UC2"){
				   		if(img.width !=800 || img.height !=480){
				   			alert("请选择分辨率为800*480的图片,点击确定后重新选择");  
				   			javascript:location.reload();
				   		}			  				   
				   }else{				   
				   		if(img.width !=880 || img.height !=528){
				            alert("请选择分辨率为800*528的图片,点击确定后重新选择");  	
				   			javascript:location.reload();								  
				   		}			   			   
				   } 			   
				   break; 
				   case "116":
				        if(img.width !=960 || img.height !=640){
				        	alert("请选择分辨率为960*640的图片,点击确定后重新选择");  
				        	javascript:location.reload();
				        }	  
				   break;
				   case "1248":
				        if(img.width !=1304 || img.height !=984){
				        	alert("请选择分辨率为1304*984的图片,点击确定后重新选择");  
				        	javascript:location.reload();
				        }	  
				   break;   
			    }
				switch(settings.IC){
					case "UC":										
						canvas.width = img.height;
						canvas.height = img.width;
						canvasContainer.appendChild(canvas);
					    ctx.translate(canvas.width/2.0, canvas.height/2.0);
					    ctx.rotate(-((Math.PI)/2));
					    ctx.translate(-canvas.width/2.0, -canvas.height/2.0);																		
					break;					
					case "UCM09":
						canvas.width = img.height;
					    canvas.height = img.width;
						canvasContainer.appendChild(canvas);
						ctx.translate(canvas.width/2.0, canvas.height/2.0);
						ctx.rotate(-((Math.PI)/2));
						ctx.translate(-canvas.width/2.0, -canvas.height/2.0);																		
					break;				   
				 	case "SSD": 			
					    canvas.width = img.height;
						canvas.height = img.width;
						canvasContainer.appendChild(canvas);
						settings["flipHorizontally"] = true;
				 		ctx.translate(canvas.width/2.0, canvas.height/2.0);
				 		ctx.rotate(-((Math.PI)/2));
				 		ctx.translate(-canvas.width/2.0, -canvas.height/2.0); 
				 	break;
				    case "SSD1":		
						canvas.width = img.width;
						canvas.height = img.height;
						canvasContainer.appendChild(canvas);
						settings["flipVertically"] = true;				
					break;				
					case "UC1":
						canvas.width = img.width;
						canvas.height = img.height;
						canvasContainer.appendChild(canvas);				
					break;						
					case "UC2":
						canvas.width = img.width;
						canvas.height = img.height;
						canvasContainer.appendChild(canvas);	
						settings["invertColors"] = true;		
					break;	
					case "UC-583":
						canvas.width = img.width;
						canvas.height = img.height;
						canvasContainer.appendChild(canvas);
						settings["invertColors"] = true;				
					break;								
					case "SSD-152":													
					    canvas.width = img.height;
						canvas.height = img.width;
						canvasContainer.appendChild(canvas);					
						settings["flipHorizontally"] = true;					
						ctx.translate(canvas.width/2.0, canvas.height/2.0);
						ctx.rotate(-((Math.PI)/2));
						ctx.translate(-canvas.width/2.0, -canvas.height/2.0);						 
					break;															
				}	
			    }else{
				canvas.width = img.width;
				canvas.height = img.height;
				canvasContainer.appendChild(canvas);
			}
			// Offset used for centering the image when requested
			var offset_x = 0;
			var offset_y = 0;
			switch(settings["scale"]){
				case "1": // Original
					if(settings["centerHorizontally"]){ offset_x = Math.round((canvas.width - img.width) / 2); }
					if(settings["centerVertically"]){ offset_y = Math.round((canvas.height - img.height) / 2); }
					ctx.drawImage(img, 0, 0, img.width, img.height,
						offset_x, offset_y, img.width, img.height);
				break;
				case "2": // Fit (make as large as possible without changing ratio)
					var horRatio = canvas.width / img.width;
					var verRatio =  canvas.height / img.height;
					var useRatio  = Math.min(horRatio, verRatio);

					if(settings["centerHorizontally"]){ offset_x = Math.round((canvas.width - img.width*useRatio) / 2); }
					if(settings["centerVertically"]){ offset_y = Math.round((canvas.height - img.height*useRatio) / 2); }
					ctx.drawImage(img, 0, 0, img.width, img.height,
						offset_x, offset_y, img.width * useRatio, img.height * useRatio);
				break;
				case "3": // Stretch x+y (make as large as possible without keeping ratio)
					ctx.drawImage(img, 0, 0, img.width, img.height,
						offset_x, offset_y, canvas.width, canvas.height);
				break;
				case "4": // Stretch x (make as wide as possible)
					offset_x = 0;
					if(settings["centerVertically"]){ Math.round(offset_y = (canvas.height - img.height) / 2); }
					ctx.drawImage(img, 0, 0, img.width, img.height,
						offset_x, offset_y, canvas.width, img.height);
				break;
				case "5": // Stretch y (make as tall as possible)
					if(settings["centerHorizontally"]){ offset_x = Math.round((canvas.width - img.width) / 2); }
					offset_y = 0;
					ctx.drawImage(img, 0, 0, img.width, img.height,
						offset_x, offset_y, img.width, canvas.height);
				break;
			}
			// Make sure the image is black and white
			if(settings.conversionFunction == ConversionFunctions.horizontal1bit
				|| settings.conversionFunction == ConversionFunctions.vertical1bit) {
				blackAndWhite(canvas, ctx);
				if(settings["invertColors"]){
					invert(canvas, ctx);
				}
			}
			// Flip image if needed
			if (settings["flipHorizontally"]) {				
					ctx.translate(canvas.width/2.0, canvas.height/2.0);
					ctx.rotate(-((Math.PI)/2));
					ctx.translate(-canvas.width/2.0, -canvas.height/2.0);
					ctx.save();
					ctx.scale(-1, 1);
					ctx.drawImage(canvas, -canvas.width, 0);
					ctx.restore();	
			}
			if (settings["flipVertically"]) {
					ctx.save();
					ctx.scale(1, -1);
					ctx.drawImage(canvas, 0, -canvas.height);
					ctx.restore();	
			}
		}

		// Handle inserting an image by pasting code
		function handleTextInput(drawMode){

			var canvas = document.createElement("canvas");
			canvas.width = parseInt(document.getElementById("text-input-width").value);
			canvas.height = parseInt(document.getElementById("text-input-height").value);
			settings["screenWidth"] = canvas.width;
			settings["screenHeight"] = canvas.height;

			if(canvasContainer.children.length) {
				canvasContainer.removeChild(canvasContainer.firstChild);
			}
			canvasContainer.appendChild(canvas);

			var image = new Image();
			images.setByIndex(0, {"img": image, "canvas" : canvas});

			var input = document.getElementById("byte-input").value;

			// Remove Arduino code
			input = input.replace(/const\s+(unsigned\s+char|uint8_t)\s+[a-zA-Z0-9]+\s*\[\]\s*(PROGMEM\s*)?=\s*/g, "");
			input = input.replace(/\};|\{/g, "");

			// Convert newlines to comma (helps to remove comments later)
			input = input.replace(/\r\n|\r|\n/g, ",");
			// Convert multiple commas in a row into a single one
			input = input.replace(/,{2,}/g, ",");
			// Remove whitespace
			input = input.replace(/\s/g, "");
			//Remove comments
			input = input.replace(/\/\/(.+?),/g, "");
			// Remove "0x"
			input = input.replace(/0[xX]/g, "");
			// Split into list
			var list = input.split(",");
			console.log(list);

			if(drawMode == "horizontal"){
				listToImageHorizontal(list, canvas);
			}else{
				listToImageVertical(list, canvas);
			}
		}

		function allSameSize(images, files) {
			if(images.length() > 1 && images.length() == files.length) {
				var inputs = imageSizeSettings.querySelectorAll("input");
				allSameSizeButton.onclick = function() {
					for(var i = 2; i < inputs.length; i++) {
						if(inputs[i].name == "width") {
							inputs[i].value = inputs[0].value;
							inputs[i].oninput();
						}
						if(inputs[i].name == "height") {
							inputs[i].value = inputs[1].value;
							inputs[i].oninput();
						}

					}
				};
				allSameSizeButton.style.display = "block";
			}
		}

		// Handle selecting an image with the file picker
		function handleImageSelection(evt){

			var files = evt.target.files;
			onlyImagesFileError.style.display = "none";

			files.length > 0 ?
				noFileSelected.style.display = "none" :
					noFileSelected.style.display = "block";

			for (var i = 0, f; f = files[i]; i++) {

				// Only process image files.
				if(!f.type.match("image.*")) {
				onlyImagesFileError.style.display = "block";
					continue;
				}

				var reader = new FileReader();

				reader.onload = (function(file) {
					return function(e) {
						// Render thumbnail.
						var img = new Image();

						img.onload = function(){

							var canvas = document.createElement("canvas");

							var imageEntry = document.createElement("li");
							imageEntry.setAttribute("data-img", file.name);

					        var h = document.createElement("input");
					        h.type = "number";
					        h.name = "width";
					        h.id = "screenWidth";
					        h.min = 0;
					        h.className = "size-input";
					        h.value = img.height;
					        settings["screenWidth"] = img.width;
					        h.oninput = function() { canvas.width = this.value; update(); updateInteger('screenWidth'); };       
					        var w = document.createElement("input");
					        w.type = "number";
					        w.name = "height";
					        w.id = "screenHeight";
					        w.min = 0;
					        w.className = "size-input";
					        w.value = img.width;
					        settings["screenHeight"] = img.height;
					        w.oninput = function() { canvas.height = this.value; update(); updateInteger('screenHeight'); };

							var gil = document.createElement("span");
							//gil.innerHTML = "glyph";
							gil.className = "file-info";

							var gi = document.createElement("input");
							gi.type = "text";
							gi.name = "glyph";
							gi.className = "glyph-input";
							gi.onchange = function() {
								var image = images.get(img);
								image.glyph = gi.value;
							};

							var fn = document.createElement("span");
							fn.className = "file-info";
							fn.innerHTML = file.name + "  (分辨率: " + img.width + " x " + img.height + ")";
							fn.innerHTML += "<br />";

							var rb = document.createElement("button");
							rb.className = "remove-button";
							rb.innerHTML = "remove";
							rb.onclick = function() {
								var image = images.get(img);
								canvasContainer.removeChild(image.canvas);
								images.remove(image);
								imageSizeSettings.removeChild(imageEntry);
								if(imageSizeSettings.children.length == 1) {
									allSameSizeButton.style.display = "none";
								}
								if(images.length() == 0) noFileSelected.style.display = "block";
								update();
							};

							imageEntry.appendChild(fn);
							imageEntry.appendChild(w);
							imageEntry.appendChild(document.createTextNode(" x "));
							imageEntry.appendChild(h);
							imageEntry.appendChild(gil);
							imageEntry.appendChild(gi);
							imageEntry.appendChild(rb);

							imageSizeSettings.appendChild(imageEntry);

							images.push(img, canvas, file.name.split(".")[0]);
							place_image(images.last());
							allSameSize(images, files);
						};
						img.src = e.target.result;
					};
				})(f);
				reader.readAsDataURL(f);
			}
		}

		function imageToString(image){
			// extract raw image data
			var ctx = image.ctx;
			var canvas = image.canvas;

			var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			var data = imageData.data;
			return settings.conversionFunction(data, canvas.width, canvas.height);
		}

		// Get the custom arduino output variable name, if any
		function getIdentifier() {
			var vn = document.getElementById("identifier");
			return vn && vn.value.length ? vn.value : identifier;
		}

		// Output the image string to the textfield
		function outputString(){

			var output_string = "", count = 1;
			var code = "";

			switch(settings["outputFormat"]) {

				case "arduino": {
					let varQuickArray = [];
					let bytesUsed     = 0;
					// --
					images.each(function(image) {
						code = imageToString(image);
				
						// 删除末尾的空格和末尾的逗号
						code = code.replace(/,\s*$/,"");
						code = "\t" + code.split("\n").join("\n\t") + "\n";
						var variableCount = images.length() > 1 ? count++ : "";
						//var comment = "// '" + image.glyph + "',"+image.canvas.height+"x"+image.canvas.width;
						bytesUsed = (code.split(",").length); // 每行16字节。
				        
						
				
				
						let varname = getIdentifier() ;
						varQuickArray.push(varname);
						code ="const" + " " + getType() + " " + varname + "[" + bytesUsed + "] = {\n" + code + "};\n";
						output_string += code;
					});
					// --
					varQuickArray.sort();
					
					// output_string += "\n// Array of all bitmaps for convenience. (Total bytes used to store images in PROGMEM = "+bytesUsed+")\n"
					// output_string += "const int " + (getIdentifier()+"allArray_LEN") + " = " + varQuickArray.length + ";\n"
					// output_string += "const " + getType() + "* " + (getIdentifier()+"allArray") + "["+varQuickArray.length+"] = {\n\t"+varQuickArray.join(",\n\t")+"\n};\n";
					
					break;
				}

				case "arduino_single": {
					var comment = "";
					images.each(function(image) {
						code = imageToString(image);
						code = "\t" + code.split("\n").join("\n\t") + "\n";
						comment = "\t// '" + image.glyph + ", " + image.canvas.width+"x"+image.canvas.height+"px\n";
						output_string += comment + code;
					});

					output_string = output_string.replace(/,\s*$/,"");

					output_string = "const " + getType() + " " +
						+ getIdentifier()
						+ " [] PROGMEM = {"
						+ "\n" + output_string + "\n};";
					break;
				}

				case "adafruit_gfx": { // bitmap
					var comment = "";
					var useGlyphs = 0;
					images.each(function(image) {
						code = imageToString(image);
						code = "\t" + code.split("\n").join("\n\t") + "\n";
						comment = "\t// '" + image.glyph + ", " + image.canvas.width+"x"+image.canvas.height+"px\n";
						output_string += comment + code;
						if(image.glyph.length == 1) useGlyphs++;
					});

					output_string = output_string.replace(/,\s*$/,"");
					output_string = "const unsigned char "
						+ getIdentifier()
						+ "Bitmap"
						+ " [] PROGMEM = {"
						+ "\n" + output_string + "\n};\n\n"
						+ "const GFXbitmapGlyph "
						+ getIdentifier()
						+ "Glyphs [] PROGMEM = {\n";

					var firstAschiiChar = document.getElementById("first-ascii-char").value;
					var xAdvance = parseInt(document.getElementById("x-advance").value);
					var offset = 0;
					code = "";

					// GFXbitmapGlyph
					images.each(function(image) {
						code += "\t{ "
							+ offset + ", "
							+ image.canvas.width + ", "
							+ image.canvas.height + ", "
							+ xAdvance + ", "
							+ "'" + (images.length() == useGlyphs ?
								image.glyph :
									String.fromCharCode(firstAschiiChar++)) + "'"
							+ " }";
						if(image != images.last()){ code += ","; }
						code += "// '" + image.glyph + "'\n";
						offset += image.canvas.width;
					});
					code += "};\n";
					output_string += code;

					// GFXbitmapFont
					output_string += "\nconst GFXbitmapFont "
						+ getIdentifier()
						+ "Font PROGMEM = {\n"
						+ "\t(uint8_t *)"
						+ getIdentifier() + "Bitmap,\n"
						+ "\t(GFXbitmapGlyph *)"
						+ getIdentifier()
						+ "Glyphs,\n"
						+ "\t" + images.length()
						+ "\n};\n";
					break;
				}
				default: { // plain
					images.each(function(image) {
						code = imageToString(image);
						var comment = image.glyph ? ("// '" + image.glyph + "', " + image.canvas.width+"x"+image.canvas.height+"px\n") : "";
						if(image.img != images.first().img) comment = "\n" + comment;
						code = comment + code;
						output_string += code;
					});
					// Trim whitespace from end and remove trailing comma
					output_string = output_string.replace(/,\s*$/g,"");
				}
			}

			document.getElementById("code-output").value = output_string;
		}

		// Use the horizontally oriented list to draw the image
		function listToImageHorizontal(list, canvas){

			var ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			var imgData = ctx.createImageData(canvas.width, canvas.height);

			var index = 0;

			var page = 0;
			var x = 0;
			var y = 7;
			// round the width up to the next byte
			var widthRoundedUp = Math.floor(canvas.width / 8 + (canvas.width % 8 ? 1 : 0)) * 8;
			var widthCounter = 0;

			// Move the list into the imageData object
			for (var i=0;i<list.length;i++){

				var binString = hexToBinary(list[i]);
				if(!binString.valid){
					alert("转换字符串时出错了。您是否忘记从输入中删除注释等内容?");
					console.log("invalid hexToBinary: ", binString.s);
					return;
				}
				binString = binString.result;
				if (binString.length == 4){
					binString = binString + "0000";
				}

				// Check if pixel is white or black
				for(var k=0; k<binString.length; k++, widthCounter++){
					// if we've counted enough bits, reset counter for next line
					if(widthCounter >= widthRoundedUp) {
						widthCounter = 0;
					}
					// skip 'artifact' pixels due to rounding up to a byte
					if(widthCounter >= canvas.width) {
						continue;
					}
					var color = 0;
					if(binString.charAt(k) == "1"){
						color = 255;
					}
					imgData.data[index] = color;
					imgData.data[index+1] = color;
					imgData.data[index+2] = color;
					imgData.data[index+3] = 255;
					index += 4;
				}
			}

			// Draw the image onto the canvas, then save the canvas contents
			// inside the img object. This way we can reuse the img object when
			// we want to scale / invert, etc.
			ctx.putImageData(imgData, 0, 0);
			var img = new Image();
			img.src = canvas.toDataURL("image/png");
			images.first().img = img;
		}

		// Use the vertically oriented list to draw the image
		function listToImageVertical(list, canvas){

			var ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			var index = 0;

			var page = 0;
			var x = 0;
			var y = 7;

			// Move the list into the imageData object
			for (var i=0;i<list.length;i++){

				var binString = hexToBinary(list[i]);
				if(!binString.valid){
					alert("转换字符串时出错了。您是否忘记从输入中删除注释等内容?");
					console.log("invalid hexToBinary: ", binString.s);
					return;
				}
				binString = binString.result;
				if (binString.length == 4){
					binString = binString + "0000";
				}

				// Check if pixel is white or black
				for(var k=0; k<binString.length; k++){
					var color = 0;
					if(binString.charAt(k) == "1"){
						color = 255;
					}
					drawPixel(ctx, x, (page*8)+y, color);
					y--;
					if(y < 0){
						y = 7;
						x++;
						if(x >= settings["screenWidth"]){
							x = 0;
							page++;
						}
					 }

				}
			}
			// Save the canvas contents inside the img object. This way we can
			// reuse the img object when we want to scale / invert, etc.
			var img = new Image();
			img.src = canvas.toDataURL("image/png");
			images.first().img = img;
		}

		// Convert hex to binary
		function hexToBinary(s) {

			var i, k, part, ret = "";
			// lookup table for easier conversion. "0" characters are
			// padded for "1" to "7"
			var lookupTable = {
				"0": "0000", "1": "0001", "2": "0010", "3": "0011", "4": "0100",
				"5": "0101", "6": "0110", "7": "0111", "8": "1000", "9": "1001",
				"a": "1010", "b": "1011", "c": "1100", "d": "1101", "e": "1110",
				"f": "1111", "A": "1010", "B": "1011", "C": "1100", "D": "1101",
				"E": "1110", "F": "1111"
			};
			for (i = 0; i < s.length; i += 1) {
				if (lookupTable.hasOwnProperty(s[i])) {
					ret += lookupTable[s[i]];
				} else {
					return { valid: false, s: s };
				}
			}
			return { valid: true, result: ret };
		}

		// Quick and effective way to draw single pixels onto the canvas
		// using a global 1x1px large canvas
		function drawPixel(ctx, x, y, color) {
			var single_pixel = ctx.createImageData(1,1);
			var d = single_pixel.data;

			d[0] = color;
			d[1] = color;
			d[2] = color;
			d[3] = 255;
			ctx.putImageData(single_pixel, x, y);
		}

		// get the type (in arduino code) of the output image
		// this is a bit of a hack, it's better to make this a property of the conversion function (should probably turn it into objects)
		function getType() {
			if (settings.conversionFunction == ConversionFunctions.horizontal565) {
				return "uint16_t";
			}else if(settings.conversionFunction == ConversionFunctions.horizontal888){
				return "unsigned long";
			}else{
				return "unsigned char";
			}
		}
		// --

		document.getElementById("outputFormat").value = "arduino";
		document.getElementById("outputFormat").onchange();
		
		document.getElementById("Modelselection").value = "UC";
		document.getElementById("Modelselection").onchange();