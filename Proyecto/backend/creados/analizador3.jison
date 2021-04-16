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
%}
%start S
%%
S:
	Prod_A EOF {temp.push(nodosAPI.agregarNodo('Prod_A','S','Prod_A'));temp.push(nodosAPI.agregarNodo('S','','ESTADO INICIAL S')); return temp;}
;
Prod_A:
	Una_A Mas Una_A {temp.push(nodosAPI.agregarNodo($1+"1",'Una_A1',$1)); temp.push(nodosAPI.agregarNodo('Una_A1','Prod_A','Una_A'));temp.push(nodosAPI.agregarNodo($2+"2",'Mas2',$2)); temp.push(nodosAPI.agregarNodo('Mas2','Prod_A','Mas'));temp.push(nodosAPI.agregarNodo($3+"3",'Una_A3',$3)); temp.push(nodosAPI.agregarNodo('Una_A3','Prod_A','Una_A'));}
;
