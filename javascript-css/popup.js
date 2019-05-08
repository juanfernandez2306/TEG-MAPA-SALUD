	
	function imagenesCondiciones(condicion){
		if (condicion == 1){
			var valor = '<center><img src="logos/ok.png"></center>';
		}else{
			var valor = '<center><img src="logos/x.png"></center>';
		}
		return valor;
	}
	
	function clasificacionCpt(clades){
		if (clades == 'CPT1'){
			var valor = "CONSULTORIO POPULAR TIPO 1";
		}else if (clades == 'CPT2'){
			var valor = "CONSULTORIO POPULAR TIPO 2";
		}else if (clades == 'CPT3'){
			var valor = "CONSULTORIO POPULAR TIPO 3";
		}else{
			var valor = "";
		}
		
		return valor;
	}
	
	function datosNulos(cadena){
		if (cadena == null){
			var valor = "";
		}else{
			var valor = String(cadena);
		}
		return valor;
	}
	
	function agregarItemsFoto(urlFoto, n){
		var arregloTexto = []
		if (String(urlFoto) != null){
			var items = "<li><a href='#tabs" + n + "'><h3><i class='fas fa-camera'></i>FOTOGRAFÍA FACHADA</h3></a></li>",
				articulo = "<article id='tabs" + n + "' class='ocultar'><br>" + "<center><img src='" + String(urlFoto) + ".jpg'></center></article>";
			arregloTexto.push(items);
			arregloTexto.push(articulo);
		}else{
			arregloTexto.push('');
			arregloTexto.push('');
		}
		
		return arregloTexto;
	}
	
	
	function popupRacs(feature){
		if (feature.properties.url_foto != null){
			var contenido = "<center><h2>"+ feature.properties.nombre + "</h2></center>" + "<nav>" +
			"<ul class='tabs'>" +
				"<li><a class='active' href='#tabs1'><h3><i class='fas fa-home'></i>INFORMACIÓN GENERAL</h3></a></li>" +
				"<li><a href='#tabs2'><h3><i class='fas fa-camera'></i>FOTOGRAFÍA FACHADA</h3></a></li>" +
			"</ul>" +
			"<section>" +
				//articulo 1
				"<article id='tabs1'><table>" +
				"<tr><th>ASIC</th><td>" + feature.properties.asic + "</td></tr>" +
				"<tr><th>NIVEL DE ATENCIÓN</th><td>RED DE ATENCIÓN COMUNAL DE SALUD</td></tr>" +
				"<tr><th>TIPO DE ESTABLECIMIENTO</th><td>" + feature.properties.tipo + "</td></tr>" +
				"<tr><th>CLASIFICACION</th><td>" + clasificacionCpt(feature.properties.clades) + "</td></tr>" +
				"<tr><th>MUNICIPIO</th><td>" + feature.properties.municipio + "</td></tr>" +
				"<tr><th>PARROQUIA</th><td>" + feature.properties.parroquia + "</td></tr>" +
				"<tr><th>COMUNIDAD</th><td>" + feature.properties.nomb_com + "</td></tr>" +
				"<tr><th>DIRECCION</th><td>" + feature.properties.direccion + "</td></tr>" +
				"</table></article>" +
				//articulo 2
				"<article id='tabs2' class='ocultar'><br><center><img src='" + String(feature.properties.url_foto) + "'></center></article></section></nav>";
		}else{
			var contenido = "<center><h2>"+ feature.properties.nombre + "</h2></center>" + "<nav><section><article><table>" + 
			"<tr><th class='titulo' colspan='2'><i class='fas fa-home'></i>INFORMACIÓN GENERAL</th></tr>" +
			"<tr><th>ASIC</th><td>" + feature.properties.asic + "</td></tr>" +
			"<tr><th>NIVEL DE ATENCIÓN</th><td>RED DE ATENCIÓN COMUNAL DE SALUD</td></tr>" +
			"<tr><th>TIPO DE ESTABLECIMIENTO</th><td>" + feature.properties.tipo + "</td></tr>" +
			"<tr><th>CLASIFICACION</th><td>" + clasificacionCpt(feature.properties.clades) + "</td></tr>" +
			"<tr><th>MUNICIPIO</th><td>" + feature.properties.municipio + "</td></tr>" +
			"<tr><th>PARROQUIA</th><td>" + feature.properties.parroquia + "</td></tr>" +
			"<tr><th>COMUNIDAD</th><td>" + feature.properties.nomb_com + "</td></tr>" +
			"<tr><th>DIRECCION</th><td>" + feature.properties.direccion + "</td></tr>" +
			"</table></article></section></nav>";
		}
			
		return contenido;
		
	}
	
	function popupRaes(feature){
		if (feature.properties.url_foto != null){
			var contenido = "<center><h2>"+ feature.properties.nombre + "</h2></center>" + "<nav>" +
			"<ul class='tabs'>" +
				"<li><a class='active' href='#tabs1'><h3><i class='fas fa-home'></i>INFORMACIÓN GENERAL</h3></a></li>" +
				"<li><a href='#tabs2'><h3><i class='fas fa-camera'></i>FOTOGRAFÍA FACHADA</h3></a></li>" +
			"</ul>" +
			"<section>" +
				//articulo 1
				"<article id='tabs1'><table>" +
				"<tr><th>ASIC</th><td>" + feature.properties.asic + "</td></tr>" +
				"<tr><th>NIVEL DE ATENCIÓN</th><td>RED DE ATENCIÓN ESPECIALIZADA DE SALUD</td></tr>" +
				"<tr><th>TIPO DE ESTABLECIMIENTO</th><td>" + feature.properties.tipo + "</td></tr>" +
				"<tr><th>MUNICIPIO</th><td>" + feature.properties.municipio + "</td></tr>" +
				"<tr><th>PARROQUIA</th><td>" + feature.properties.parroquia + "</td></tr>" +
				"<tr><th>COMUNIDAD</th><td>" + datosNulos(feature.properties.comunidad) + "</td></tr>" +
				"<tr><th>DIRECCION</th><td>" + feature.properties.direccion + "</td></tr>" +
				"</table></article>" +
				//articulo 2
				"<article id='tabs2' class='ocultar'><br><center><img src='" + String(feature.properties.url_foto) + "'></center></article></section></nav>";
		}else{
			var contenido = "<center><h2>"+ feature.properties.nombre + "</h2></center>" + "<nav><section><article><table>" + 
			"<tr><th class='titulo' colspan='2'><i class='fas fa-home'></i>INFORMACIÓN GENERAL</th></tr>" +
			"<tr><th>ASIC</th><td>" + feature.properties.asic + "</td></tr>" +
			"<tr><th>NIVEL DE ATENCIÓN</th><td>RED DE ATENCIÓN ESPECIALIZADA DE SALUD</td></tr>" +
			"<tr><th>TIPO DE ESTABLECIMIENTO</th><td>" + feature.properties.tipo + "</td></tr>" +
			"<tr><th>MUNICIPIO</th><td>" + feature.properties.municipio + "</td></tr>" +
			"<tr><th>PARROQUIA</th><td>" + feature.properties.parroquia + "</td></tr>" +
			"<tr><th>COMUNIDAD</th><td>" + datosNulos(feature.properties.comunidad) + "</td></tr>" +
			"<tr><th>DIRECCION</th><td>" + feature.properties.direccion + "</td></tr>" +
			"</table></article></section></nav>";
		}
			
		return contenido;
		
	}
	
	function popupCDI(feature){
			
		var contenido = "<center><h2>"+ feature.properties.nombre + "</h2></center><nav>" +
		"<ul class='tabs'>" +
			"<li><a class='active' href='#tabs1'><h3><i class='fas fa-home'></i>INFORMACIÓN GENERAL</h3></a></li>" +
			agregarItemsFoto(feature.properties.url_foto, 2)[0] + 
		"</ul>" +
		"<section>" +
			//articulo 1
			"<article id='tabs1'><table>" +
			"<tr><th>ASIC</th><td>" + feature.properties.asic + "</td></tr>" +
			"<tr><th>NIVEL DE ATENCIÓN</th><td>RED DE ATENCIÓN ESPECIALIZADA DE SALUD</td></tr>" +
			"<tr><th>TIPO DE ESTABLECIMIENTO</th><td>" + feature.properties.tipo + "</td></tr>" +
			"<tr><th>MUNICIPIO</th><td>" + feature.properties.municipio + "</td></tr>" +
			"<tr><th>PARROQUIA</th><td>" + feature.properties.parroquia + "</td></tr>" +
			"<tr><th>COMUNIDAD</th><td>" + datosNulos(feature.properties.comunidad) + "</td></tr>" +
			"<tr><th>DIRECCION</th><td>" + feature.properties.direccion + "</td></tr>" +
			"</table></article>" +
			agregarItemsFoto(feature.properties.url_foto, 2)[1] +
		"</section>" + 
		"</nav>";
			
		return contenido;
		
	}
	
	function popupHospitales(feature){
		if (feature.properties.url_foto != null){
			var contenido = "<center><h2>"+ feature.properties.nombre + "</h2></center>" + "<nav>" +
			"<ul class='tabs'>" +
				"<li><a class='active' href='#tabs1'><h3><i class='fas fa-home'></i>INFORMACIÓN GENERAL</h3></a></li>" +
				"<li><a href='#tabs2'><h3><i class='fas fa-camera'></i>FOTOGRAFÍA FACHADA</h3></a></li>" +
			"</ul>" +
			"<section>" +
				//articulo 1
				"<article id='tabs1'><table>" +
				"<tr><th>ASIC</th><td>" + feature.properties.asic + "</td></tr>" +
				"<tr><th>NIVEL DE ATENCIÓN</th><td>RED DE ATENCIÓN HOSPITALARIA</td></tr>" +
				"<tr><th>TIPO DE ESTABLECIMIENTO</th><td>" + feature.properties.tipo + "</td></tr>" +
				"<tr><th>MUNICIPIO</th><td>" + feature.properties.municipio + "</td></tr>" +
				"<tr><th>PARROQUIA</th><td>" + feature.properties.parroquia + "</td></tr>" +
				"<tr><th>COMUNIDAD</th><td>" + datosNulos(feature.properties.comunidad) + "</td></tr>" +
				"<tr><th>DIRECCION</th><td>" + feature.properties.direccion + "</td></tr>" +
				"</table></article>" +
				//articulo 2
				"<article id='tabs2' class='ocultar'><br><center><img src='" + String(feature.properties.url_foto) + "'></center></article></section></nav>";
		}else{
			var contenido = "<center><h2>"+ feature.properties.nombre + "</h2></center>" + "<nav><section><article><table>" + 
			"<tr><th class='titulo' colspan='2'><i class='fas fa-home'></i>INFORMACIÓN GENERAL</th></tr>" +
			"<tr><th>ASIC</th><td>" + feature.properties.asic + "</td></tr>" +
			"<tr><th>NIVEL DE ATENCIÓN</th><td>RED DE ATENCIÓN HOSPITALARIA</td></tr>" +
			"<tr><th>TIPO DE ESTABLECIMIENTO</th><td>" + feature.properties.tipo + "</td></tr>" +
			"<tr><th>MUNICIPIO</th><td>" + feature.properties.municipio + "</td></tr>" +
			"<tr><th>PARROQUIA</th><td>" + feature.properties.parroquia + "</td></tr>" +
			"<tr><th>COMUNIDAD</th><td>" + datosNulos(feature.properties.comunidad) + "</td></tr>" +
			"<tr><th>DIRECCION</th><td>" + feature.properties.direccion + "</td></tr>" +
			"</table></article></section></nav>";
		}
		
		return contenido;
		
	}