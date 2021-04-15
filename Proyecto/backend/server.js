const express = require('express');
var cors = require('cors');
var app = express();
var fs = require('fs');
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');
const generador = require('./analizador/jis');
var Parser = require('jison').Parser;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.post('/analizar',function(req,res,next){
    var texto = req.body.text;
    var no_terminales = [];
    var terminales = [];
    var producciones = [];
    var con_produc = [];
    var errores = [];
    var escribir_terminales = [];
    console.log(texto);
    var ast = generador.parse(texto);
    var str = JSON.stringify(ast, null, 2);
    fs.writeFileSync('./analizador/gen.json', str);
    var datos = JSON.parse(str);
    var inicial = datos.sintactico.estado_inicial;
    for (let dato of datos.sintactico.lista_no_terminales){
        if (no_terminales.includes(dato.id)){
            errores.push("ERROR: tienes repetido el no terminal "+dato.id);
        } else {
            no_terminales.push(dato.id);
        }
    }
    for (let dato of datos.lexico){
        if (terminales.includes(dato.token)){
            errores.push("ERROR: tienes repetido un el terminal "+dato.token);
        } else {
            terminales.push(dato.token);
            escribir_terminales.push([dato.lexema,"return '"+dato.token+"';"]);
        }
    }
    escribir_terminales.push(["\\s+","/* skip whitespace */"]);
    escribir_terminales.push(["<<EOF>>","return 'EOF';"]);
    escribir_terminales.push([".","return 'INVALID';"]);
    if (!no_terminales.includes(inicial)){
        errores.push("ERROR: no has definido el no terminal inicial "+inicial);
    }
    for (let dato of datos.sintactico.lista_producciones){
        if (producciones.includes(dato.id_no_terminal)){
            errores.push("ERROR: tienes dos producciones con el mismo id "+dato.id_no_terminal+" por favor, reduce");
        } else {
            producciones.push(dato.id_no_terminal);
        }
        var temp = [];
        let numero_produccion = 1;
        for (let adentro of dato.producciones){
            let conteo = 0;
            let temporal = "";
            for (let mas of adentro.particiones){
                if (conteo == 0){
                    if (mas.parte == dato.id_no_terminal){
                        errores.push("ERROR: recursividad en la produccion de "+dato.id_no_terminal+" en la linea "+dato.linea+" regla numero "+numero_produccion);
                    }
                }
                if (temporal==mas.parte){
                    errores.push("ERROR: tienes una cadena de "+mas.parte+" en la linea "+mas.linea+" y en la regla de produccion numero "+numero_produccion+", reduce.");
                }
                if (!no_terminales.includes(mas.parte) && !terminales.includes(mas.parte)){
                    errores.push("ERROR: en la linea "+mas.linea+" y columna "+mas.columna+", simbolo "+mas.parte+" no se encuentra definido");
                }
                conteo++;
                temporal = mas.parte;
            }
            numero_produccion++;
        }
        numero_produccion = 1;
        con_produc.push(temp);
    }
    console.log(escribir_terminales);
    var grammar = {
        "lex": {
            "rules": escribir_terminales
        },
        "bnf": {
            "numero" :[ "numero $_NUMERO",
                             "$_Letra"]
        }
    };
    //var parser = new Parser(grammar);
    //var parserSource = parser.generate();
    //fs.writeFileSync('./analizador/analizado.js', parserSource);
    res.status(200).json({errores: errores});
});

app.get('/cantidad',(req,res)=>{
    fs.readFile('./analizador/creados.txt', 'utf-8', (err, data) => {
        if(err) {
          console.log('error: ', err);
        } else {
            var ar = data.split('%');
            res.status(200).json({lon: ar.length,archs:data});
        }
      });
});

app.listen(3000,()=>{
    console.log('App running on port: 3000');
});