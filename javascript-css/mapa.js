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
		JSON_ASIC, JSON_CDI, JSON_HOSPITAL,
		JSON_RACS, JSON_RAES] = objArrayResponse;
	
	const initial_coordinates = [10.90847, -72.08446];
	
	var map = L.map('map', {
		center: initial_coordinates,
		zoom: 10,
		minZoom: 10,
		maxZoom: 18
	});
	
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
			mouseout: resetHighlight
		});
	}
	
	var customOptions = {
			'Width': '400px',
			'maxHeight': '400px',
			'className' : 'custom'
		};
		
	function consultToFeaturePoint(e){
		var props = e.target.feature.properties;
		console.log(props);
	}
		
	var iconoCDI = L.icon({
			iconUrl: URL_IMG_CDI, 
			iconSize: [30, 30]
		}),
		iconoHospital = L.icon({
			iconUrl: URL_IMG_HOSPITAL, 
			iconSize: [35, 35]
		}),
		iconoAmbulatorio = L.icon({
			iconUrl: URL_IMG_CPT1, 
			iconSize: [25, 25]
		}),
		iconoCMP = L.icon({
			iconUrl: URL_IMG_CPT2, 
			iconSize: [25, 25]
		}),
		iconoRAES = L.icon({
			iconUrl: URL_IMG_RAES, 
			iconSize: [30, 30]
		});
		
	function simblogiaCDI(feature, latlng){
		var icono = L.marker(latlng,{icon: iconoCDI});
		return icono;
	};
	
	function simblogiaHospital(feature, latlng){
		var icono = L.marker(latlng,{icon: iconoHospital});
		return icono;
	};
	
	function filtroCMP(feature, layer){
		return feature.properties.tipo == 'CONSULTORIO MEDICO POPULAR'
	};
			
	function filtroAMB(feature, layer){
		return feature.properties.tipo != 'CONSULTORIO MEDICO POPULAR'
	};
	
	function simblogiaRacs(feature, latlng){
		if (feature.properties.tipo != "CONSULTORIO MEDICO POPULAR"){
			var icono = L.marker(latlng,{icon: iconoAmbulatorio});
		}
		else{
			var icono = L.marker(latlng,{icon: iconoCMP});
		}
		return icono;
	};
	
	function simblogiaRAES(feature, latlng){
		var icono = L.marker(latlng,{icon: iconoRAES});
		return icono;
	};
	
	function onEachFeature(feature, layer) {
		layer.on('click', function(e){
			var props = e.target.feature.properties,
				sidebar = document.querySelector('.sidebar');
				
			sidebar.classList.remove('hiddenSidebar');
			sidebar.classList.add('showSidebar');
			sidebar.classList.add('translate-background-show');
			setTimeout(function(){
				sidebar.classList.remove('translate-background-show');
			}, 2000);
			
			console.log(props);
		});
	}
	
	var ptsCDI = L.geoJson(JSON_CDI, 
			{ pointToLayer: simblogiaCDI ,
			onEachFeature: onEachFeature}
		),
		ptsHospitales = L.geoJson(JSON_HOSPITAL, 
			{ pointToLayer: simblogiaHospital ,
			onEachFeature: onEachFeature}
		),
		ptsRacsCMP = L.geoJson(JSON_RACS, 
			{ filter: filtroCMP, pointToLayer: simblogiaRacs ,
			onEachFeature: onEachFeature}
		),
		ptsRacsAMB = L.geoJson(JSON_RACS, 
			{ filter: filtroAMB, pointToLayer: simblogiaRacs,
			onEachFeature: onEachFeature}
		),
		ptsRAES = L.geoJson(JSON_RAES, 
			{ pointToLayer: simblogiaRAES,
			onEachFeature: onEachFeature}
		);
		
	var parentGroup = L.markerClusterGroup();
		
	mySubGroup = L.featureGroup.subGroup(parentGroup, [ptsCDI]);
	mySubGroup1 = L.featureGroup.subGroup(parentGroup, [ptsHospitales]);
	mySubGroup2 = L.featureGroup.subGroup(parentGroup, [ptsRacsCMP]);
	mySubGroup3 = L.featureGroup.subGroup(parentGroup, [ptsRacsAMB]);
	mySubGroup4 = L.featureGroup.subGroup(parentGroup, [ptsRAES]);
	
	control = L.control.layers(null, null, { collapsed: true,  position: 'topright'}).addTo(map);
	parentGroup.addTo(map);
	control.addOverlay(mySubGroup2, `<img src="${URL_IMG_CPT1}" width="25"/><b>CONSULTORIO MÉDICO POPULAR</b>`);
	control.addOverlay(mySubGroup3, `<img src="${URL_IMG_CPT2}" width="25"/><b>AMBULATORIO RED COMUNAL</b>`);
	control.addOverlay(mySubGroup4, `<img src="${URL_IMG_RAES}" width="25"/><b>AMBULATORIO RED ESPECIALIZADA</b>`);
	control.addOverlay(mySubGroup, `<img src="${URL_IMG_CDI}" width="25"/><b>CENTRO DE DIAGNOSTICO INTEGRAL</b>`);
	control.addOverlay(mySubGroup1, `<img src="${URL_IMG_HOSPITAL}" width="35"/><b>HOSPITALES</b>`);
	mySubGroup.addTo(map);
	mySubGroup1.addTo(map);
	mySubGroup2.addTo(map);
	mySubGroup3.addTo(map);
	mySubGroup4.addTo(map);

	function addInfoLayer(){
		
		if(map.hasLayer(geojson)){
			map.removeLayer(geojson);
		}
		
		const mediaquery = "(max-width: 576px) or (pointer: coarse)";
		
		if(window.matchMedia(mediaquery).matches){
			
			map.removeControl(info);
			
			geojson = L.geoJson(JSON_ASIC , {
				style: style
			});
			
			map.setZoom(9);
			map.setMinZoom(9);
			map.setView(initial_coordinates, 9);
			
		}else{
			
			info.addTo(map);
			
			geojson = L.geoJson(JSON_ASIC , {
				style: style,
				onEachFeature: onEachFeature
			});
			
		}
		
		geojson.addTo(map)
		
	}
	
	addInfoLayer();
	
	window.addEventListener('resize', addInfoLayer, false);
}

function createMaprespaldo(){
    const map = L.map('map', {
		center: [10.90847, -72.08446],
		zoom: 10,
		minZoom: 10,
		maxZoom: 18,
		fullscreenControl: true,
		fullscreenControlOptions: {
			title:"Show me the fullscreen !",
			titleCancel:"Exit fullscreen mode"}
	});
	
	// detect fullscreen toggling
	map.on('enterFullscreen', function(){
		if(window.console) window.console.log('enterFullscreen');
		});
			
	map.on('exitFullscreen', function(){
		if(window.console) window.console.log('exitFullscreen');
		});
	
	
	//Mapa Base de OpenStreetMap
	var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
		minZoom: 7,
		maxZoom: 19,
		type:'osm'
		}).addTo(map);
		
	// Mapa Base de Google layers
		
	// Google Satelite
	var hybridMutant = L.gridLayer.googleMutant({
		type:'hybrid'
		});
		
	// Definición de variables de los mapa base	
	var mapabase = {
		"Mapa base de OpenStreetMap" : osm,
		"Mapa base de Google Satelite" : hybridMutant};
	
	//Agregar CONTROL para mostrar la información de la capa de  ASIC
	var info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
			return this._div;
			};

		info.update = function (props) {
			
			function seleccionarParroquias(cobertura, parroquia){
				if (cobertura != '1'){
					var texto = String(parroquia).split(','),
						valor = '<strong>PARROQUIA</strong>: ' + texto.join(' - ') + '<br>';
				}else{
					var valor = "";
				}
				return valor;
			}
			
			var urlLogo = "https://i.ibb.co/rpb72kc/logo-asic.png";
			
			this._div.innerHTML = '<div class="cuerpo"><div class="encabezadoImg"><img src="' + urlLogo + '" width="40"></div><div class="encabezado"><h4><center><strong> AREA DE SALUD INTEGRAL COMUNITARIO (ASIC)</strong></center></h4></div></div>' + (props ?
			'<div class="cuerpo"><b><center>' + props.asic + '</center></b>'
			+ '<br><strong>MUNICIPIO</strong>: ' + String(props.municipios).replace(',', ' - ') + '<br>'
			+ seleccionarParroquias(props.cobertura_mun, props.parr) + '</div>'
			: '<div class="cuerpo"><center>DESPLACE EL CURSOR SOBRE UN ASIC</center></div>');
		};

		info.addTo(map);
		
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

				if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
					layer.bringToFront();
					}

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

		function onEachFeature(feature, layer) {
					layer.on({
						mouseover: highlightFeature,
						mouseout: resetHighlight
					});
				}

		geojson = L.geoJson(asic , {
					style: style,
					onEachFeature: onEachFeature
				}).addTo(map);
				
		//-----------------------------------
		
		var escala = L.control.scale({imperial: false}).addTo(map);
		
		//-----------------------------------
		
		var customOptions = {
			'maxWidth': '700px',
			'maxHeight': '400px',
			'className' : 'custom'
		};
		
		var rutaIconoCDI = "https://i.ibb.co/gT1Vq6q/CDI.png",
			rutaIconoHospital = "https://i.ibb.co/8xGz1Xz/HOSPITAL.png",
			rutaIconoAmbulatorio = "https://i.ibb.co/D7SwCJW/CPT1.png",
			rutaIconoCMP = "https://i.ibb.co/QY879dr/CPT2.png",
			rutaIconoRAES = "https://i.ibb.co/tJM3Ps2/RAES.png",
			iconoCDI = L.icon({iconUrl: rutaIconoCDI, iconSize: [30, 30]}),
			iconoHospital = L.icon({iconUrl: rutaIconoHospital, iconSize: [35, 35]}),
			iconoAmbulatorio = L.icon({iconUrl: rutaIconoAmbulatorio, iconSize: [25, 25]}),
			iconoCMP = L.icon({iconUrl: rutaIconoCMP, iconSize: [25, 25]}),
			iconoRAES = L.icon({iconUrl: rutaIconoRAES, iconSize: [30, 30]});
		
		function simblogiaCDI(feature, latlng){
			var icono = L.marker(latlng,{icon: iconoCDI});
				icono.bindPopup(popupCDI(feature), customOptions);
			return icono;
		};
		
		function simblogiaHospital(feature, latlng){
			var icono = L.marker(latlng,{icon: iconoHospital});
				icono.bindPopup(popupHospitales(feature), customOptions)
			return icono;
		};
		
		function filtroCMP(feature, layer){
			return feature.properties.tipo == 'CONSULTORIO MEDICO POPULAR'
		};
				
		function filtroAMB(feature, layer){
			return feature.properties.tipo != 'CONSULTORIO MEDICO POPULAR'
		};
		
		function simblogiaRacs(feature, latlng){
			if (feature.properties.tipo != "CONSULTORIO MEDICO POPULAR"){
				var icono = L.marker(latlng,{icon: iconoAmbulatorio});
			}
			else{
				var icono = L.marker(latlng,{icon: iconoCMP});
			}
			icono.bindPopup(popupRacs(feature), customOptions);
			return icono;
		};
		
		function simblogiaRAES(feature, latlng){
			var icono = L.marker(latlng,{icon: iconoRAES});
				icono.bindPopup(popupRaes(feature), customOptions);
			return icono;
		};
		
		
		//-----------------------------------------------
		
		var ptsCDI = L.geoJson(cdi, { pointToLayer: simblogiaCDI }),
			ptsHospitales = L.geoJson(hospitales, { pointToLayer: simblogiaHospital }),
			ptsRacsCMP = L.geoJson(racs, { filter: filtroCMP, pointToLayer: simblogiaRacs }),
			ptsRacsAMB = L.geoJson(racs, { filter: filtroAMB, pointToLayer: simblogiaRacs }),
			ptsRAES = L.geoJson(raes, { pointToLayer: simblogiaRAES });
		
		var parentGroup = L.markerClusterGroup();
		
		mySubGroup = L.featureGroup.subGroup(parentGroup, [ptsCDI]);
		mySubGroup1 = L.featureGroup.subGroup(parentGroup, [ptsHospitales]);
		mySubGroup2 = L.featureGroup.subGroup(parentGroup, [ptsRacsCMP]);
		mySubGroup3 = L.featureGroup.subGroup(parentGroup, [ptsRacsAMB]);
		mySubGroup4 = L.featureGroup.subGroup(parentGroup, [ptsRAES]);
		
		control = L.control.layers(mapabase, null, { collapsed: true,  position: 'topright'}).addTo(map);
		parentGroup.addTo(map);
		control.addOverlay(mySubGroup2, '<img src="' + rutaIconoCMP + '" width="25"/>' + '<b>CONSULTORIO MÉDICO POPULAR</b>');
		control.addOverlay(mySubGroup3, '<img src="' + rutaIconoAmbulatorio + '" width="25"/>' + '<b>AMBULATORIO RED COMUNAL</b>');
		control.addOverlay(mySubGroup4, '<img src="' + rutaIconoRAES + '" width="25"/>' + '<b>AMBULATORIO RED ESPECIALIZADA</b>');
		control.addOverlay(mySubGroup, '<img src="' + rutaIconoCDI + '" width="25"/>' + '<b>CENTRO DE DIAGNOSTICO INTEGRAL</b>');
		control.addOverlay(mySubGroup1, '<img src="' + rutaIconoHospital + '" width="35"/>' + '<b>HOSPITALES</b>');
		mySubGroup.addTo(map);
		mySubGroup1.addTo(map);
		mySubGroup2.addTo(map);
		mySubGroup3.addTo(map);
		mySubGroup4.addTo(map);
		
		//--------------
		$('#map').on('click', 'ul.tabs li a', function() {
			
			$('ul.tabs li a').removeClass('active');
			$(this).addClass('active');
			$('section article').hide();
			
			var activeTab = $(this).attr('href');
			$(activeTab).show();
			
			return false;
			
		});
}