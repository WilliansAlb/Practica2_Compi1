%lex
%%
"a"			return "Una_A";
"+"			return "Mas";
"."			return "Punto";
"("			return "P_Ab";
"dfasdfa"			return "P_Ce";
[aA-zZ]			return "Letra";
[0-9]			return "NUMERO";
[0-9]+			return "NUMEROS_A";
<<EOF>>			return "EOF"
.			return "INVALID"
/lex
%{
	const nodosAPI = require('C:/Users/willi/OneDrive/Escritorio/Proyectos 2021/Practica2_Compi1/Proyecto/backend/creados/nodos').nodosAPI;
var temp = [];
var responde;
%}
%start S
%%
S:
	S Mas S EOF {temp.push(nodosAPI.agregarNodo('S','S','S'));temp.push(nodosAPI.agregarNodo($2+"2",'Mas2',$2)); temp.push(nodosAPI.agregarNodo('Mas2','S','Mas'));temp.push(nodosAPI.agregarNodo('S','S','S'));temp.push(nodosAPI.agregarNodo('S','','ESTADO INICIAL S')); responde = temp; temp = []; return responde;}
	| Una_A EOF {temp.push(nodosAPI.agregarNodo($1+"1",'Una_A1',$1)); temp.push(nodosAPI.agregarNodo('Una_A1','S','Una_A'));temp.push(nodosAPI.agregarNodo('S','','ESTADO INICIAL S')); responde = temp; temp = []; return responde;}
;
