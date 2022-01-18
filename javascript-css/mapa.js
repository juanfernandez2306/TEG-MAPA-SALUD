/**
 * @typeof {Object} props
 * @property {Array} properties - features
 * @property {String} properties.asic - ASIC name
 * @property {String} properties.municipio
 * @property {String} properties.parroquia
 * @property {String} properties.direccion
 * @property {String} properties.nombre
 * @property {String} properties.tipo
 * @property {String} properties.url_foto
 * @property {Number} properties.cod_tipo
 */

/**
 * creation of table information of properties
 * of the geojson layer of health establishment
 * @param {Object} props
 * @returns {String} html - text string formatted as html table 
 */
function createTableInfo(props){
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

function createDiv(urlLogo, props){
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

function createMap(objArrayResponse){
	
	const [URL_IMG_LUZ, URL_IMG_POSTGRADO, URL_IMG_GEODESIA,
		URL_IMG_ASIC, URL_IMG_CDI, URL_IMG_HOSPITAL,
		URL_IMG_CPT1, URL_IMG_CPT2, URL_IMG_RAES,
		JSON_ASIC, JSON_ESTABLECIMIENTOS_SALUD] = objArrayResponse;

	document.getElementById('imgLuz').src = URL_IMG_LUZ;
	document.getElementById('imgPost').src = URL_IMG_POSTGRADO;
	document.getElementById('imgGeo').src = URL_IMG_GEODESIA;
	
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
	
	var info = L.control();

	info.onAdd = function(map){
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	}
	
	info.update = function(props){
		var html = createDiv(URL_IMG_ASIC, props);
		
		this._div.innerHTML = html;
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

	var geojson;

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

	function onEachFeaturePoint(feature, layer) {
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
	
	/**
		*selection of the type of icon according 
		to the feature cod_tipo parameter of geojson layer
		*@param {Object} feature - feature of geojson
		*@param {Object} latlng - feature of geojson apply leafletjs
	*/
		
	function selection_establishments_icons(feature, latlng){
		var icon;
		
		if (feature.properties.cod_tipo == 1){
			icon = L.marker(latlng,
				{icon: L.icon({iconUrl: URL_IMG_HOSPITAL,
				iconSize: [35, 35]})
				}
			);
		}else if(feature.properties.cod_tipo == 2){
			icon = L.marker(latlng,
				{icon: L.icon({
						iconUrl: URL_IMG_CDI,
						iconSize: [30, 30]
					})
				}
			);
		}else if(feature.properties.cod_tipo == 3){
			icon = L.marker(latlng,
				{icon: L.icon({
						iconUrl: URL_IMG_RAES,
						iconSize: [30, 30]
					})
				}
			);
		}else if(feature.properties.cod_tipo == 4){
			icon = L.marker(latlng,
				{icon: L.icon({
						iconUrl: URL_IMG_CPT2,
						iconSize: [30, 30]
					})
				}
			);
		}else if(feature.properties.cod_tipo == 5){
			icon = L.marker(latlng,
				{icon: L.icon({
						iconUrl: URL_IMG_CPT1,
						iconSize: [30, 30]
					})
				}
			);
		}
		
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
		return L.geoJson(JSON_ESTABLECIMIENTOS_SALUD,{
			filter: function(feature, layer){
				return feature.properties.cod_tipo == cod_tipo
			},
			pointToLayer: selection_establishments_icons,
			onEachFeature: onEachFeaturePoint
		});
	}

	info.addTo(map);
			
	geojson = L.geoJson(JSON_ASIC , {
		style: style,
		onEachFeature: onEachFeature
	});

	geojson.addTo(map);
	
	var pts_hospitales = filter_layers_geojson(1),
		pts_cdi = filter_layers_geojson(2),
		pts_raes = filter_layers_geojson(3),
		pts_amb = filter_layers_geojson(4),
		pts_cmp = filter_layers_geojson(5);
	
	var parentGroup = L.markerClusterGroup();
		
	mySubGroup = L.featureGroup.subGroup(parentGroup, [pts_cdi]);
	mySubGroup1 = L.featureGroup.subGroup(parentGroup, [pts_hospitales]);
	mySubGroup2 = L.featureGroup.subGroup(parentGroup, [pts_cmp]);
	mySubGroup3 = L.featureGroup.subGroup(parentGroup, [pts_amb]);
	mySubGroup4 = L.featureGroup.subGroup(parentGroup, [pts_raes]);
	
	control = L.control.layers(mapbase, null, { collapsed: true,  position: 'topright'}).addTo(map);
	parentGroup.addTo(map);
	control.addOverlay(mySubGroup2, `<img src="${URL_IMG_CPT1}" width="25"/><b class="txtlegend">CONSULTORIO MÉDICO POPULAR</b>`);
	control.addOverlay(mySubGroup3, `<img src="${URL_IMG_CPT2}" width="25"/><b class="txtlegend">AMBULATORIO RED COMUNAL</b>`);
	control.addOverlay(mySubGroup4, `<img src="${URL_IMG_RAES}" width="25"/><b class="txtlegend">AMBULATORIO RED ESPECIALIZADA</b>`);
	control.addOverlay(mySubGroup, `<img src="${URL_IMG_CDI}" width="25"/><b class="txtlegend">CENTRO DE DIAGNOSTICO INTEGRAL</b>`);
	control.addOverlay(mySubGroup1, `<img src="${URL_IMG_HOSPITAL}" width="35"/><b class="txtlegend">HOSPITALES</b>`);
	mySubGroup.addTo(map);
	mySubGroup1.addTo(map);
	mySubGroup2.addTo(map);
	mySubGroup3.addTo(map);
	mySubGroup4.addTo(map);
	
}