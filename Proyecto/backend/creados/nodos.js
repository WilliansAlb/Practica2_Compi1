function nuevoNodo(id_nodo, padre,nombre) {
	return {
		id: id_nodo,
		parent: padre,
        name: nombre
	}
}

const nodosAPI = {
	agregarNodo: function(id, padre,nombre) {
		return nuevoNodo(id, padre,nombre);
	}
}
module.exports.nodosAPI = nodosAPI;
