function setup() {
 
    createCanvas( windowWidth, windowHeight )

    drums = EDrums('x*o*x*o-x*oo*xo-')
    follow = Follow( drums )
  
}

function draw() {
  //console.log(window.abc)
  background( follow.getValue() * 255 )
}