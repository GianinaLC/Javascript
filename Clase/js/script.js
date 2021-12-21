let nombre = prompt("Ingresa su nombre");
let apellido = prompt("Ingresa tu apellido");
let edad = prompt("Ingresa tu edad");

let jubilacionEdad = 65;
let jubilacion = parseInt(jubilacionEdad - edad);


alert ("Mucho gusto" + " " + nombre + " " + apellido + ", tienes" + " " + edad + " " + "años.");
alert ("Te jubilarás dentro de" + " " + jubilacion + " " + "años.");