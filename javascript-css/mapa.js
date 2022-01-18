/**
 * @typeof {Object} propsLayerPoint - health facility properties
 * @property {Array} properties - features
 * @property {String} properties.asic - ASIC name
 * @property {String} properties.municipio - municipality name
 * @property {String} properties.parroquia - parish name DPT
 * @property {String} properties.direccion - direction
 * @property {String} properties.nombre - name health establishment
 * @property {String} properties.tipo - types of health establishments
 * @property {String} properties.url_foto - facade photo url
 * @property {Number} properties.cod_tipo - own coding criteria
 * 1 -> Hospital	2 -> CDI	3 -> RAES
 * 4 -> AMB RACS	5 -> CMP
 */

/**
 * creation of table information of properties
 * of the geojson layer of health establishment
 * @param {Object} propsLayerPoint
 * @returns {String} html - text string formatted as html table 
 */
function createTableInfo(propsLayerPoint){
	var props = propsLayerPoint;
	var html = `
		<table class="">
			<caption>Establecimiento de Salud</caption>
			<tr>
				<th>NOMBRE</th>
				<td>${props.nombre}</td>
			</tr>
			<tr>
				<th>ASIC</th>
				<td>${props.asic}</td>
			</tr>
			<tr>
				<th>TIPO DE ESTABLECIMIENTO</th>
				<td>${props.tipo}</td>
			</tr>
			<tr>
				<th>MUNICIPIO</th>
				<td>${props.municipio}</td>
			</tr>
			<tr>
				<th>PARROQUIA</th>
				<td>${props.parroquia}</td>
			</tr>
			<tr>
				<th>DIRECCION</th>
				<td>${props.direccion}</td>
			</tr>
		</table>
	`;
	
	return html;
}

/**
 * @typeof {Object} propsFeaturePolygon - feature layer ASIC
 * @param {Array} properties - default features layer 
 * @param {String} properties.asic - health geography area name DPT
 * @param {String} properties.muncipios - name of the municipalities of the ASIC
 * @param {String} properties.parr - name of the parish DPT of the ASIC
 * @param {Boolean} properties.cobertura_mun - if [false|null] when unique municipality
 */

/**
 * create div hover features polygon ASIC
 * @param {String} urlLogo - url img logo ASIC
 * @param {Object} propsFeaturePolygon - feature layer ASIC
 * @return {String} html - text string formatted as html element div info
 */
function createDivHoverFeaturePolygonASIC(urlLogo, propsFeaturePolygon){
	var props = propsFeaturePolygon;
	var html = `
		<div class="headerInfoMap">
			<div>
				<img src="${urlLogo}" width="40px">
			</div>
			<div>
				<h4>
					AREA DE SALUD INTEGRAL COMUNITARIO (ASIC)
				</h4>
			</div>
		</div>
	`;

	if (props){
		var textMun = String(props.municipios).replace(',', ' - '),
			arrayMun = String(props.municipios).split(','),
			asic = props.asic;
			
		var nameMun = 'MUNICIPIO';
		var nameParr = 'PARROQUIA';
			
		if(arrayMun.length > 1){
			nameMun += 'S';
		}
		
		if (props.cobertura_mun != '1'){
			var arrayParr = String(props.parr).split(','),
				textParr = arrayParr.join(' - ');
				
			if(arrayParr.length > 1){
				nameParr += 'S';
			}
			
			var info = `<p>
				<strong>${nameParr}</strong>: ${textParr}<br>
			</p>`;
		}else{
			var info = '';
		}
		
		html += `
			<div class="bodyInfoMap">
				<p>
					<b>${asic}</b>
				</p>
				<p>
					<strong>${nameMun}</strong>: ${textMun}
				</p>
				${info}
			</div>
		`;
		
	}else{
		html += `<div class="bodyInfoMap">
			<p>DESPLACE EL CURSOR SOBRE UN ASIC</p>
		</div>`;
	}

	return html;
	
}



/**
 * add polygon layer ASIC in map
 * @param {Object} map - element object leaflet
 * @param {Blob} url_logo - blob img logo ASIC
 * @param {Object} json_layer_point - layer geojson point
 */

function addLayerPolygonASIC({map, url_logo, json_layer_asic}){

	var info = L.control();

	info.onAdd = function(map){
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	}
	
	info.update = function(props){
		var html = createDivHoverFeaturePolygonASIC(url_logo, props);
		
		this._div.innerHTML = html;
	}

	function style(feature) {
		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.1,
			fillColor: '#ff00ffff'
		};
	}

	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.1
			});

		info.update(layer.feature.properties);
	};

	function resetHighlight(e) {
		geojson.resetStyle(e.target);
		info.update();
	}

	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	}

	function onEachFeature(feature, layer){
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}

	var geojson = L.geoJson(json_layer_asic , {
		style: style,
		onEachFeature: onEachFeature
	});

	info.addTo(map);
	geojson.addTo(map);

}

/**
 * @typeof {Object} json_layer_point
 * @property {String} type - default value feature collection
 * @property {Array} features
 * @property {Array} features.feature
 * @property {String} features.feature.type - default value Feature
 * @property {Array} features.feature.geometry
 * @property {String} features.feature.geometry.type - defaul value Point
 * @property {Array} features.feature.geometry.coordinates - [x, y] | [longitud, latitud]
 * @property {Array} features.feature.properties -as view propsLayerPoint
 */

/**
 * filter layers of health facilities
 * @param {Number} cod_tipo - numeric code with range from 1 to 5
 * @param {Object} json_layer_point - layer geojson
 * @param {Array} array_logos - photographic array of 5 elements of the health facility icons
 * @returns {Object} geojson - object leaflet geojson
 */

function filterLayerPont({cod_tipo, json_layer_point, array_logos}){
	
	/**
		*selection of the type of icon according 
		to the feature cod_tipo parameter of geojson layer
		*@param {Object} feature - feature of geojson
		*@param {Object} latlng - feature of geojson apply leafletjs
	*/
	function onEachFeature(feature, layer) {
		layer.on('click', function(e){
			var props = e.target.feature.properties,
				sidebar = document.querySelector('.sidebar');
				
			sidebar.classList.remove('hiddenSidebar');
			sidebar.classList.add('showSidebar');
			sidebar.classList.add('clip-path-show');
			
			var html = createTableInfo(props),
				sidebarContent = document.getElementById('sidebarContent');
				
			sidebarContent.innerHTML = html;
			
			if(props.url_foto != null){
				var divImg = `
				<div class='container-img'>
					<img src='${props.url_foto}' alt='fachada'>
				</div>`;
				
				sidebarContent.innerHTML += divImg;
			}
			
			setTimeout(function(){
				sidebar.classList.remove('clip-path-show');
			}, 500);
			
		});
	}

	function selection_establishments_icons(feature, latlng){
		var cod_tipo = feature.properties.cod_tipo,
			widthIcon = (cod_tipo == 1) ? 35: 30,
			url_img = array_logos[cod_tipo - 1];

		var icon = L.marker(latlng,
				{icon: L.icon({
						iconUrl: url_img,
						iconSize: [widthIcon, widthIcon]})
			});
		
		return icon;
	};

	/**
		*filter geojson layers according to the type 
		of health establishment to define the icon,
		*@param {Number} cod_tipo - feature of geojson
		default values
		1 -> hospital
		2 -> cdi
		3 -> raes
		4 -> ambulatorio red comunal
		5 -> consultorio medico popular
	*/

	function filter_layers_geojson(cod_tipo){
		return L.geoJson(json_layer_point,{
			filter: function(feature, layer){
				return feature.properties.cod_tipo == cod_tipo
			},
			pointToLayer: selection_establishments_icons,
			onEachFeature: onEachFeature
		});
	}

	var geojson = filter_layers_geojson(cod_tipo);

	return geojson;
}

function createMap({url_logo, array_logos, json_layer_asic, json_layer_point}){
	
	const initial_coordinates = [10.90847, -72.08446];
	
	var map = L.map('map', {
		center: initial_coordinates,
		zoom: 10,
		minZoom: 10,
		maxZoom: 18,
		gestureHandling: true,
		fullscreenControl: true,
		fullscreenControlOptions: {
			title:"Show me the fullscreen !",
			titleCancel:"Exit fullscreen mode"}
	});

	var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
		minZoom: 7,
		maxZoom: 19,
		type:'osm'
		}).addTo(map);
	
	var hybridMutant = L.gridLayer.googleMutant({
		type:'hybrid'
		});
		
	var mapbase = {
		"Mapa base de OpenStreetMap" : osm,
		"Mapa base de Google Satelite" : hybridMutant
	};
	
	var escala = L.control.scale({imperial: false}).addTo(map);

	addLayerPolygonASIC({
		'map': map,
		'url_logo': url_logo,
		'json_layer_asic': json_layer_asic
	});

	
	var pts_hospitales = filterLayerPont({
			'cod_tipo': 1,
			'json_layer_point': json_layer_point,
			'array_logos': array_logos
		}),
		pts_cdi = filterLayerPont({
			'cod_tipo': 2,
			'json_layer_point': json_layer_point,
			'array_logos': array_logos
		}),
		pts_raes = filterLayerPont({
			'cod_tipo': 3,
			'json_layer_point': json_layer_point,
			'array_logos': array_logos
		}),
		pts_amb = filterLayerPont({
			'cod_tipo': 4,
			'json_layer_point': json_layer_point,
			'array_logos': array_logos
		}), 
		pts_cmp = filterLayerPont({
			'cod_tipo': 5,
			'json_layer_point': json_layer_point,
			'array_logos': array_logos
		});
	
	var parentGroup = L.markerClusterGroup();
		
	mySubGroup = L.featureGroup.subGroup(parentGroup, [pts_cdi]);
	mySubGroup1 = L.featureGroup.subGroup(parentGroup, [pts_hospitales]);
	mySubGroup2 = L.featureGroup.subGroup(parentGroup, [pts_cmp]);
	mySubGroup3 = L.featureGroup.subGroup(parentGroup, [pts_amb]);
	mySubGroup4 = L.featureGroup.subGroup(parentGroup, [pts_raes]);
	
	control = L.control.layers(mapbase, null, { collapsed: true,  position: 'topright'}).addTo(map);
	parentGroup.addTo(map);
	control.addOverlay(mySubGroup2, `<img src="${array_logos[4]}" width="25"/><b class="txtlegend">CONSULTORIO MÉDICO POPULAR</b>`);
	control.addOverlay(mySubGroup3, `<img src="${array_logos[3]}" width="25"/><b class="txtlegend">AMBULATORIO RED COMUNAL</b>`);
	control.addOverlay(mySubGroup4, `<img src="${array_logos[2]}" width="25"/><b class="txtlegend">AMBULATORIO RED ESPECIALIZADA</b>`);
	control.addOverlay(mySubGroup, `<img src="${array_logos[1]}" width="25"/><b class="txtlegend">CENTRO DE DIAGNOSTICO INTEGRAL</b>`);
	control.addOverlay(mySubGroup1, `<img src="${array_logos[0]}" width="35"/><b class="txtlegend">HOSPITALES</b>`);
	mySubGroup.addTo(map);
	mySubGroup1.addTo(map);
	mySubGroup2.addTo(map);
	mySubGroup3.addTo(map);
	mySubGroup4.addTo(map);
	
}