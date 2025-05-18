var modify = true;
    var timeleft = 0;

    const timer = document.getElementById('timer');
  
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

      setTimeout(() => countDown(m), 1000);

      } else {

        timer.textContent = "00:00"
        modify = true;
        warning.textContent = 'Pinte ☺';
      
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

    for (let x = 0; x < 100; x++) {
      for (let y = 0; y < 100; y++) {
        /*console.log(x+','+y)*/
        const pixel = document.createElement('div');
        pixel.classList.add('pixel');
        pixel.id = (x + ',' + y);
      
        pixel.addEventListener('click', () => {
          
          if (modify== true) {

            pixel.style.backgroundColor = colorPicker.value;
        
            modify = false;
            
            countDown(30);
          
          } else {

            warning.textContent = 'Perese';
          
          };
        });
        canvas.appendChild(pixel);
      };
    };

    const serchfor = document.getElementById('20,20')
    serchfor.style.backgroundColor = "#ff00ff";