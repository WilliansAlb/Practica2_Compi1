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
"|"                  return 'O'
"$_"({identificador}|"_")+   return 'IDTERMINAL'
"%_"({identificador}|"_")+   return 'IDNOTERMINAL'
("'"|"‘")             this.begin("string");
<string>[^'’]+       return "CARACTER";
<string>("'"|"’")     this.popState();
"[aA-zZ]"             return 'TODAS'
"[0-9]"               return 'NUMEROS'
"*"                   return 'ESTRELLA'
"+"                   return 'CERRADURA'
"?"                   return 'INTERROGACIONC'
":}}"                  return 'FINSYN'
":}"                  return 'FINLEX'
{int}{frac}?\b        return 'NUMBER'
{letras}              return 'LETRAS'
("#")                 this.begin("coment");
<coment>[^\n\r]+        return "COMENTARIO";
<coment>[\n]          this.popState();
{espacio}             /*solo ignora*/
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%start expressions

%% /* language grammar */

expressions:
    posibilidad_comentarios bloque_analizar posibilidad_comentarios EOF { return 'encontrado'}
;

posibilidad_comentarios:
    | cadena_comentarios
;

cadena_comentarios:
    COMENTARIO cadena_comentariosP
;

cadena_comentariosP:
    | cadena_comentarios
;

bloque_analizar:
    WISON posibilidad_comentarios INTERROGACIONA bloque_lexico bloque_sintactico INTERROGACIONC posibilidad_comentarios WISON
;

bloque_lexico:
    posibilidad_comentarios LEXP posibilidad_comentarios INICIOLEX bloque_terminales FINLEX
;

bloque_terminales:
    terminal1 bloque_terminalesP
;

bloque_terminalesP:
    | bloque_terminales
;

terminal1:
    TERMINAL IDTERMINAL ASIGNAR asignacion_terminal PUNTOC bloque_comentarios
;

asignacion_terminal:
    CARACTER
    | TODAS
    | NUMEROS numerando
;

numerando:
    | ESTRELLA
    | CERRADURA
    | INTERROGACIONC
;

bloque_sintactico:
    posibilidad_comentarios SYNTAXP posibilidad_comentarios INICIOSYN bloque_no_terminales FINSYN
;

bloque_no_terminales:
    bloque_asignacion_no SIMBOLOINICIAL IDNOTERMINAL PUNTOC bloque_producciones
;

bloque_asignacion_no:
    asignacion_no_terminal bloque_asignacion_noP
;

bloque_asignacion_noP:
    | bloque_asignacion_no
;

asignacion_no_terminal:
    NOTERMINAL IDNOTERMINAL PUNTOC bloque_comentarios
;

bloque_producciones:
    produccion bloque_produccionesP
;

bloque_produccionesP:
    | bloque_producciones
;

produccion:
    IDNOTERMINAL ASIGNARNOTERMINAL posibilidad_comentarios cadena_no_terminales PUNTOC
;

cadena_no_terminales:
    IDNOTERMINAL cadena_no_terminalesP
    | IDTERMINAL cadena_no_terminalesP
;

cadena_no_terminalesP:
    | cadena_no_terminales
;

bloque_comentarios:
    | COMENTARIO
;