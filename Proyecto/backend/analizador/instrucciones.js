function nuevoTerminal(id_terminal, terminal) {
	return {
		token: id_terminal,
		lexema: terminal
	}
}

function nuevoNoTerminal(id_no_terminal){
	return {
		id: id_no_terminal
	}
}


const instruccionesAPI = {
	nuevoTerminalAgregar: function(id_terminal, terminal) {
		return nuevoTerminal(id_terminal, terminal);
	},
	nuevoNoTerminalAgregar: function(id_terminal){
		return nuevoNoTerminal(id_terminal);
	},nuevoListaTerminales: function (terminales){
		var terms = []; 
		terms.push(terminales);
		return terms;
	},nuevoListaNoTerminales: function (no_terminales){
		var no_terms = []; 
		no_terms.push(no_terminales);
		return no_terms;
	},nuevaListaTerms: function(listado, listado2){
		return {
			lexico: listado,
			sintactico: listado2
		}
	},nuevaProduccion: function(id,linea,columna,produccion){
		return {
			id_no_terminal: id,
			linea: linea,
			columna: columna,
			producciones: produccion
		}
	},nuevaListaProduccion: function(listado){
		var produc = [];
		produc.push(listado);
		return produc;
	},nuevoParte: function(parte,linea,columna){
		return {
			parte: parte,
			linea: linea,
			columna: columna
		}
	},nuevaListaProduccion2: function(listado){
		var produc = [];
		produc.push(listado);
		return produc;
	},nuevaSintactico: function(listado, estado, producciones){
		return {
			lista_no_terminales: listado,
			estado_inicial: estado,
			lista_producciones: producciones
		}
	},nuevaCadena: function (lis) {
		return {
			particiones: lis
		}	
	}
}
module.exports.instruccionesAPI = instruccionesAPI;
