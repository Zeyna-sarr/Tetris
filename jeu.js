document.addEventListener('DOMContentLoaded', () =>
{


const grille = document.querySelector('.grille');
let cases = Array.from(document.querySelectorAll('.grille div')); 
const lescore = document.getElementById('score');
const startBtn = document.getElementById('start');

const taille = 10 ;
let nextChoice = 0;
let timerId;
let score = 0;
let i;

const colors = [
	'blue',
	'red',
	'yellow',
	'purple',
	'green'
]

//Création tétromines en utilisant la méthode (taille*i)+j sur la grande grille


// Chaque tétromine a quatres rotations et les tétromines ont des noms(l,z,t,o,i)
//chaque type de tétro est un tableau de rotations et chaque rotation a quatres cases(les cases portent les indices du grand grille de 200)


const lTetromine = [

	[1,(taille*1)+1,taille*2+1,2],
	[taille,taille+1,taille+2,taille*2+2],
	[1,taille+1,taille*2+1,taille*2],
	[taille,taille*2,taille*2+1,taille*2+2]

]

const zTetromine = [
    [0, taille, taille + 1, taille * 2 + 1],
    [taille + 1, taille + 2, taille * 2, taille * 2 + 1],
    [0, taille, taille + 1, taille * 2 + 1],
    [taille + 1, taille + 2, taille * 2, taille * 2 + 1]
]

const tTetromine = [
    [1, taille, taille + 1, taille + 2],
    [1, taille + 1, taille + 2, taille * 2 + 1],
    [taille, taille + 1, taille + 2, taille * 2 + 1],
    [1, taille, taille + 1, taille * 2 + 1]
]

const oTetromine = [
    [0, 1, taille, taille + 1],
    [0, 1, taille, taille + 1],
    [0, 1, taille, taille + 1],
    [0, 1, taille, taille + 1]
]

const iTetromine = [
    [1, taille + 1, taille * 2 + 1, taille * 3 + 1],
    [taille, taille + 1, taille + 2, taille + 3],
    [1, taille + 1, taille * 2 + 1, taille * 3 + 1],
    [taille, taille + 1, taille + 2, taille + 3]
]


const lesTetromines = [lTetromine,zTetromine,tTetromine,oTetromine,iTetromine];



let positionCourant = 4 ; 
let rotation = 0; // cad tjrs la 1ère rotation

//Sélection d'une tétromine au hasard et de 1ère rotation

let choix = Math.floor(Math.random()*lesTetromines.length);


let nouveau = lesTetromines[choix][rotation] ; //[0][0] lTetromine et 1ère rotation .ET avec choix ici il choisira un type de tétro au hasard

//Dessiner la Tetromine

function dessiner()
{
	nouveau.forEach(indice => {

		cases[positionCourant + indice].classList.add('tetromine');
		cases[positionCourant + indice].style.backgroundColor = colors[choix];
	});
}

//dessiner();

// effacer la Tetromine

function effacer()
{
	nouveau.forEach(indice => {

		cases[positionCourant + indice].classList.remove('tetromine');
		cases[positionCourant + indice].style.backgroundColor = '';
	});
}

// effacer();


//Déplacer la tétromine
//timerId = setInterval(descendre, 500);

// Controler les keycodes
function control(e)
{
	if(e.keyCode === 37){
		moveleft();
	}

	else if(e.keyCode === 38){
		rotate();
	}

	else if(e.keyCode === 39){
		moveright();
	}

	else if(e.keyCode === 40){
		descendre();
	}


}
document.addEventListener('keyup', control);


function descendre()
{
	effacer();
	positionCourant += taille;
	dessiner();
	freeze();
}

// fontion freeze
function freeze()
{
	if(nouveau.some(indice => cases[positionCourant + indice + taille].classList.contains('taken')))
	{
		nouveau.forEach(indice => cases[positionCourant + indice].classList.add('taken'));

		//Faire descendre un nouveau

		choix = nextChoice;
		nextChoice = Math.floor(Math.random()*lesTetromines.length);
		nouveau = lesTetromines[choix][rotation];
		positionCourant = 4;
		dessiner();
		displaymini();
		gameOver();
		addScore();
	}
}

//Moveleft et arreter en cas de Blockage

function moveleft()
{
	effacer();

	const bordGauche = nouveau.some(indice => (positionCourant + indice) % taille === 0);

	if(!bordGauche) 
		positionCourant -=1;

	if(nouveau.some(indice => cases[positionCourant + indice].classList.contains('taken')))
		positionCourant +=1;

	dessiner();
}

function moveright()
{
	effacer();

	const bordDroite = nouveau.some(indice => (positionCourant + indice) % taille === taille-1);

	if(!bordDroite){
		positionCourant +=1;
	}

	if(nouveau.some(indice => cases[positionCourant + indice].classList.contains('taken'))){
		positionCourant -=1;
	}

	dessiner();
}


function rotate()
{
	effacer();
	rotation ++;

	if(rotation === nouveau.length){
		rotation = 0;
	}

	nouveau = lesTetromines[choix][rotation];
	dessiner();

}


//Montrer les tétro suivants dans le mini
const displayCases = document.querySelectorAll('.mini-grille div');
const displaywidth = 4;
let displayIndice = 0;

// les tetro sans rotations
const miniTetro = [
	[1, displaywidth + 1,displaywidth*2+1,2],
	[0, displaywidth, displaywidth + 1, displaywidth * 2 + 1],
	[1, displaywidth, displaywidth + 1, displaywidth + 2],
	[0, 1, displaywidth, displaywidth + 1],
	[1, displaywidth + 1, displaywidth * 2 + 1, displaywidth * 3 + 1]
]

function displaymini()
{
	displayCases.forEach(square => {
		square.classList.remove('tetromine');
		square.style.backgroundColor = '';
	}); 

	miniTetro[nextChoice].forEach(indice => {
		displayCases[displayIndice + indice].classList.add('tetromine');
		displayCases[displayIndice + indice].style.backgroundColor = colors[nextChoice];

	});
}


// Fonctionnalités pour les boutons
startBtn.addEventListener('click', function() {
	if(timerId){
		clearInterval(timerId);
		timerId=null;
	}
	else
	{
		dessiner();
		timerId = setInterval(descendre, 500);
		nextChoice = Math.floor(Math.random() * lesTetromines.length);
		displaymini();
	}


});


function addScore()
{
  for(i=0; i<199; i +=taille)
  {
  	const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

  	if(row.every(indice => cases[indice].classList.contains('taken')))
  	  {
  		score +=10;
  		lescore.innerHTML = score;
  		row.forEach(indice => {
  			
  			cases[indice].classList.remove('taken');
			cases[indice].classList.remove('tetromine');
		    cases[indice].style.backgroundColor = '';
  	  });

  	const casesRemoved = cases.splice(i, taille);
  	cases = casesRemoved.concat(cases);
  	cases.forEach(cell => grille.appendChild(cell));

  	//console.log(casesRemoved);

  	}
  }
}


//Game Over
function gameOver()
{
	if(nouveau.some(indice => cases[positionCourant + indice].classList.contains('taken'))){
		lescore.innerHTML = 'end';
		clearInterval(timerId);
	}
}




})