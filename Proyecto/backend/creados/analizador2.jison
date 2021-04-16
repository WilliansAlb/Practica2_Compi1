%lex
"a"     return "$_Una_A";
"+"     return "$_Mas";
"."     return "$_Punto";
"("     return "$_P_Ab";
"dfasdfa"     return "$_P_Ce";
[aA-zZ]     return "$_Letra";
[0-9]     return "$_NUMERO";
[0-9]*     return "$_NUMEROS";
[0-9]+     return "$_NUMEROS_A";
