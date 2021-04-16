const jison = require('jison');
const fs = require('fs');

function escribiendo_doc(json){
    var texto = "%lex\n%%\n";
    for (let dato of json.lexico){
        if (dato.lexema.includes('[aA-zZ]') || dato.lexema.includes('[0-9]')){
            texto += dato.lexema+"     return \""+dato.token.replace("$_","")+"\";\n";
        } else {
            texto += "\""+dato.lexema+"\"     return \""+dato.token.replace("$_","")+"\";\n";
        } 
    }
    texto += "/lex\n";
    texto += "%start "+json.sintactico.estado_inicial.replace("%_","")+"\n";
    fs.readFile('./creados/creados.txt', 'utf-8', (err, data) => {
        if(err) {
          console.log('error: ', err);
        } else {
            if (data!=''){
                var cuantos = data.split("%");
                var conteo = cuantos.length+1;
                fs.writeFileSync('./creados/analizador'+conteo+'.jison', texto);
                fs.writeFileSync('./creados/creados.txt', data+"%analizador"+conteo);
            } else {
                fs.writeFileSync('./creados/analizador1.jison', texto);
                fs.writeFileSync('./creados/creados.txt', "analizador1");
            }
        }
      });
}

const escrituraAPI = {
	escribir: function(json) {
		return escribiendo_doc(json);
	}
}

module.exports.escrituraAPI = escrituraAPI;