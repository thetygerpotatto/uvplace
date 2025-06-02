var modify = true;
    var timeleft = 0;

    const timer = document.getElementById('timer');
    const timer1 = document.getElementById('timer1');
    const clockgif = document.getElementById('clock-gif');
    const randomizer = document.getElementById('randbutton');
    
    function randmodify(){
      
      var x = Math.floor(Math.random() * (100 - 0 + 1));
      var y = Math.floor(Math.random() * (100 - 0 + 1));
      var r = Math.floor(Math.random() * (10 - 0 + 1)) ;
      var g = Math.floor(Math.random() * (10 - 0 + 1)) ;
      var b = Math.floor(Math.random() * (10 - 0 + 1)) ;
      const pix = document.getElementById(x+','+y);
      pix.style.backgroundColor = "000000";
      alert(`${x},${y}`)
      
    }
    
    randomizer.addEventListener('click', () => {
      randmodify();
    });


    function gettime(){
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
    
      function updatetimer(){
        
        setTimeout(() => gettime(), 1000);
  
        timer1.textContent = (`${hours}:${minutes}:${seconds}`);
      };
      updatetimer();
    }
    
    gettime();

    var text = "00:";
    function updatetimer(m){
      if(m >=10){
        timer.textContent = "00:" + m;
      } else {
        timer.textContent = "00:0" + m;
      }
    };

    function countDown(m){
      
      updatetimer(m);

      m--;

      if(m >= 0){
      timer.style.color = '#ff0000';
      clockgif.style.backgroundColor = '#ff0000'; 
      setTimeout(() => countDown(m), 1000);

      } else {

        timer.textContent = "00:00"
        modify = true;
        timer.style.color = '#00ff00';
        warning.textContent = 'Pinte ☺';
        clockgif.style.backgroundColor = '#000000'; 
      };
        
    };

    const backgroundpicker = document.getElementById('backgroundpicker');
    backgroundpicker.addEventListener('click', () => {
        document.body.style.backgroundColor = backgroundpicker.value;
      });

    const canvas = document.getElementById('canvas');
    
  
    const colorPicker = document.getElementById('color-picker');

    const palette = document.getElementById('palette');
    palette.addEventListener('click', () => {
        colorPicker.value = palette.value;
      });
    const palette2 = document.getElementById('palette2');
    palette2.addEventListener('click', () => {
        colorPicker.value = palette2.value;
      });
    const palette3 = document.getElementById('palette3');
    palette3.addEventListener('click', () => {
        colorPicker.value = palette3.value;
      });
    const palette4 = document.getElementById('palette4');
    palette4.addEventListener('click', () => {
        colorPicker.value = palette4.value;
      });
    const palette5 = document.getElementById('palette5');
    palette5.addEventListener('click', () => {
        colorPicker.value = palette5.value;
      });
    
    const palette6 = document.getElementById('palette6');
    palette6.addEventListener('click', () => {
        colorPicker.value = palette6.value;
      });
    const palette7 = document.getElementById('palette7');
    palette7.addEventListener('click', () => {
        colorPicker.value = palette7.value;
      });
    const palette8 = document.getElementById('palette8');
    palette8.addEventListener('click', () => {
        colorPicker.value = palette8.value;
      });
    const palette9 = document.getElementById('palette9');
    palette9.addEventListener('click', () => {
        colorPicker.value = palette9.value;
      });
    const palette10 = document.getElementById('palette10');
    palette10.addEventListener('click', () => {
        colorPicker.value = palette10.value;
      });

    const warning = document.getElementById('warning');

    function modifytrue(){
      modify = true;
    };
    
    // Crear 50x50 = 2500 píxeles

    for (let x = 1; x < 101; x++) {
      for (let y = 1; y < 101; y++) {
        /*console.log(x+','+y)*/
        const pixel = document.createElement('div');
        pixel.classList.add('pixel');
        pixel.id = (x + ',' + y);
        
        pixel.addEventListener('mouseover', () => {

          showposition(pixel.id);

        });
        canvas.addEventListener('mouseleave', () => {

          showposition(' ');

        });

        pixel.addEventListener('click', () => {
          
          if (modify== true) {

            pixel.style.backgroundColor = colorPicker.value;
        
            modify = false;
            
            countDown(5);
          
          } else {

            warning.textContent = 'Perese';
          
          };
        });
        canvas.appendChild(pixel);
      };
    };
   
    const serchfor = document.getElementById('20,20')
    serchfor.style.backgroundColor = "#ff00ff";

    //uncomment the following for debbug
    const palettecontainer = document.getElementById('colorpalette');
    const pixid = document.createElement('div');
    pixid.textContent = 'x,y:';
    pixid.classList.add('timer');
    palettecontainer.appendChild(pixid);
    
    function showposition(p) {
      pixid.textContent = 'x,y:'+p;
    };
    // "1,2,3".split(","); will return ["1", "2", "3"]