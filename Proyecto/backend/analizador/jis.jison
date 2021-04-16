/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
int  "-"?([0-9]|[1-9][0-9]+)
exp  [eE][-+]?[0-9]+
frac  "."[0-9]+
letras [a-zA-Z]+
espacio [\s|\n|\t|\r]+
identificador [a-zA-Z]+([a-zA-Z]|[0-9]+)*
especial [á-ü]|[«#$%&/()=*.+-]
wis [wW][iI][sS][oO][nN]
lexi [lL][eE][xX]
term [tT][eE][rR][mM][iI][nN][aA][lL]
nterm [nN][oO]"_"[tT][eE][rR][mM][iI][nN][aA][lL]
sy [sS][yY][nN][tT][aA][xX]
in [iI][nN][iI][tT][iI][aA][lL]"_"[sS][iI][mM]
%x string
%x coment
%x coment2
%%
{wis}              return 'WISON'
"¿"                   return 'INTERROGACIONA'
{lexi}                 return 'LEXP'
"{:"                  return 'INICIOLEX'
{term}            return 'TERMINAL'
{nterm}            return 'NOTERMINAL'
{sy}             return 'SYNTAXP'
{in}            return 'SIMBOLOINICIAL'
"{{:"                 return 'INICIOSYN'
"<-"                  return 'ASIGNAR'
"<="                  return 'ASIGNARNOTERMINAL'
";"                  return 'PUNTOC'
("|"|"OR")            	return 'OR'
"$_"({identificador}|"_")+   return 'IDTERMINAL'
"%_"({identificador}|"_")+   return 'IDNOTERMINAL'
("'"|"‘")             this.begin("string");
<string>[^'’]+       return "CARACTER";
<string>("'"|"’")     this.popState();
"[aA-zZ]"             return 'TODAS'
"[0-9]"               return 'NUMEROS'
"+"                   return 'CERRADURA'
"?"                   return 'INTERROGACIONC'
":}}"                  return 'FINSYN'
"*"                   return 'ESTRELLA'
":}"                  return 'FINLEX'
{int}{frac}?\b        return 'NUMBER'
{letras}              return 'LETRAS'
("#")                 this.begin("coment");
<coment>[^\n]+        /*return "COMENTARIO";*/
<coment>[\n]          this.popState();
"/**"                 this.begin("coment2");
<coment2>[^*/]+        /*return "COMENTARIO";*/
<coment2>"*/"          this.popState();
{espacio}             /*solo ignora*/
<<EOF>>               return 'EOF'
.                     return 'INVALID'


/lex

%{
	const instruccionesAPI	= require('./instrucciones').instruccionesAPI;
	var temp = []; 
	var conteo = 0;
	var doble = [];
%}
/* operator associations and precedence */

%start expressions

%% /* language grammar */

expressions:
    bloque_analizar  EOF { return $1;}
;


bloque_analizar:
    WISON INTERROGACIONA bloque_lexico bloque_sintactico INTERROGACIONC WISON { $$ = instruccionesAPI.nuevaListaTerms($3,$4); }
;

bloque_lexico:
     LEXP INICIOLEX bloque_terminales FINLEX { $$ = $3; }
;

bloque_terminales:
    bloque_terminales terminal1 { $1.push($2); $$ = $1; }
	| terminal1 { $$ = instruccionesAPI.nuevoListaTerminales($1);}
;

terminal1:
    TERMINAL IDTERMINAL ASIGNAR asignacion_terminal PUNTOC  {$$ = instruccionesAPI.nuevoTerminalAgregar($2,$4);}
;

asignacion_terminal:
    CARACTER { $$ = $1;}
    | TODAS numerando { $$ = $1+$2;}
    | NUMEROS numerando { $$ = $1+$2;}
;

numerando:
    { $$ = "";}
    | ESTRELLA { $$ = $1;}
    | CERRADURA { $$ = $1;}
    | INTERROGACIONC { $$ = $1;}
;

bloque_sintactico:
    SYNTAXP INICIOSYN bloque_no_terminales FINSYN { $$ = $3; }
;

bloque_no_terminales:
    bloque_asignacion_no SIMBOLOINICIAL IDNOTERMINAL PUNTOC bloque_producciones {$$ = instruccionesAPI.nuevaSintactico($1,$3,$5);}
;

bloque_asignacion_no:
    bloque_asignacion_no asignacion_no_terminal {$1.push($2); $$ = $1}
	| asignacion_no_terminal { $$ = instruccionesAPI.nuevoListaNoTerminales($1);}
;


asignacion_no_terminal:
    NOTERMINAL IDNOTERMINAL PUNTOC  {$$ = instruccionesAPI.nuevoNoTerminalAgregar($2);}
;

bloque_producciones:
    bloque_producciones produccion {$1.push($2); $$ = $1;}
	| produccion  { $$ = instruccionesAPI.nuevaListaProduccion2($1);}
;

produccion:
    IDNOTERMINAL ASIGNARNOTERMINAL bloque_cadena PUNTOC { $$ = instruccionesAPI.nuevaProduccion($1,this._$.first_line,this._$.first_column,temp); temp=[];}
;

bloque_cadena:
	bloque_cadena OR cadena { temp.push(instruccionesAPI.nuevaCadena($3));}
	| cadena { temp.push(instruccionesAPI.nuevaCadena($1));}
;


cadena:
    cadena parte_produccion {$1.push($2); $$ = $1}
	| parte_produccion { $$ = instruccionesAPI.nuevaListaProduccion($1);}
;

parte_produccion:
    IDTERMINAL	{ $$ = instruccionesAPI.nuevoParte($1,this._$.first_line,this._$.first_column);}
	| IDNOTERMINAL { $$ = instruccionesAPI.nuevoParte($1,this._$.first_line,this._$.first_column);}
;
