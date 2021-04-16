const jison = require('jison');
const fs = require('fs');
function escribiendo_doc(json){
    var texto = "%lex\n%%\n";
    for (let dato of json.lexico){
        if (dato.lexema.includes('[aA-zZ]') || dato.lexema.includes('[0-9]')){
            texto += dato.lexema+"\t\t\treturn \""+dato.token.replace("$_","")+"\";\n";
        } else {
            texto += "\""+dato.lexema+"\"\t\t\treturn \""+dato.token.replace("$_","")+"\";\n";
        } 
    }
    texto+="<<EOF>>\t\t\treturn \"EOF\"\n";
    texto+=".\t\t\treturn \"INVALID\"\n";
    texto += "/lex\n";
    texto += "%{\n";
    texto += "\tconst nodosAPI = require('C:/Users/willi/OneDrive/Escritorio/Proyectos 2021/Practica2_Compi1/Proyecto/backend/creados/nodos').nodosAPI;\nvar temp = [];\nvar responde;\n%}\n";
    texto += "%start "+json.sintactico.estado_inicial.replace("%_","")+"\n%%\n";
    for (let dato of json.sintactico.lista_producciones){
        texto+= dato.id_no_terminal.replace("%_","")+":\n\t";
        var sin2 = dato.id_no_terminal.replace("%_","");
        let conteo = 1;
        for (let adentro of dato.producciones){
            let posicion = 1;
            var otro = "{";
            for (let mas of adentro.particiones){
                texto+= mas.parte.replace("$_", "").replace("%_","")+" ";
                var sin = mas.parte.replace("$_", "").replace("%_","");
                if (mas.parte.includes('$_')){
                    otro+= "temp.push(nodosAPI.agregarNodo($"+posicion+"+\""+posicion+"\",'"+sin+posicion+"',$"+posicion+")); temp.push(nodosAPI.agregarNodo('"+sin+posicion+"','"+sin2+"','"+sin+"'));"; 
                } else {
                    otro+= "temp.push(nodosAPI.agregarNodo('"+sin+"','"+sin2+"','"+sin+"'));"
                }
                posicion++;
            }
            if (dato.id_no_terminal===json.sintactico.estado_inicial){
                texto+= "EOF ";
                otro+= "temp.push(nodosAPI.agregarNodo('"+sin2+"','','ESTADO INICIAL "+sin2+"')); responde = temp; temp = []; return responde;";
            }
            texto+= otro+"}";
            if (conteo==Object.keys(dato.producciones).length){
                texto+="\n";
            } else {
                texto+="\n\t| ";
            }
            conteo++;
        }
        texto+= ";\n";
    }

    fs.readFile('./creados/creados.txt', 'utf-8', (err, data) => {
        if(err) {
          console.log('error: ', err);
        } else {
            if (data!=''){
                var cuantos = data.split("%");
                var conteo = cuantos.length+1;
                fs.writeFileSync('./creados/analizador'+conteo+'.jison', texto);
                fs.writeFileSync('./creados/creados.txt', data+"%analizador"+conteo);
                var bnf = fs.readFileSync("./creados/analizador"+conteo+".jison", "utf8");
                var parser = new jison.Parser(bnf);
                fs.writeFileSync('./creados/analizador'+conteo+'.js', parser.generate());
            } else {
                fs.writeFileSync('./creados/analizador1.jison', texto);
                fs.writeFileSync('./creados/creados.txt', "analizador1");
                var bnf = fs.readFileSync("./creados/analizador1.jison", "utf8");
                var parser = new jison.Parser(bnf);
                fs.writeFileSync('./creados/analizador1.js', parser.generate());
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