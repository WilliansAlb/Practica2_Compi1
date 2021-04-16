%lex
%%
"a"     return 'Una_A'
"+"     return "Mas"
"."     return "Punto"
"("     return "P_Ab"
"dfasdfa"     return "P_Ce"
[aA-zZ]     return "Letra"
[0-9]     return "NUMERO"
[0-9]*     return "NUMEROS"
[0-9]+     return "NUMEROS_A"
