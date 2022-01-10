function closeSidebar(e){
	e.preventDefault();
	var btn = e.target;
	const sidebar = document.querySelector('div.sidebar');
	
	btn.disabled = true;
	sidebar.classList.add('translate-background');
	setTimeout(function(){
		sidebar.classList.remove('showSidebar');
		sidebar.classList.add('hiddenSidebar');
		btn.removeAttribute('disabled');
		sidebar.classList.remove('translate-background');
	}, 2000);
}

async function getFetch(url, type){
	try{
		const response = await fetch(url);
		
		if(type == 'json'){
			return await response.json();
			
		}else if(type == 'img'){
			var blob = await response.blob();
			
			return URL.createObjectURL(blob);
		}
		
	}
	catch(error){
		console.log(error);
	}
}

function init(){
	const elementBtnClose = ['a.closebtn', 'button.btn-close'];
	
	elementBtnClose.forEach(elem => {
		var btn = document.querySelector(elem);
		
		btn.addEventListener('click', closeSidebar, false);
	})
	
	Promise.all([
		getFetch('https://i.ibb.co/J7wFTm8/LUZ.jpg', 'img'),
		getFetch('https://i.ibb.co/N1TXJLX/postgrado.png', 'img'),
		getFetch('https://i.ibb.co/bdhnd2z/geodesia-LUZ.png', 'img'),
		getFetch('https://i.ibb.co/rpb72kc/logo-asic.png', 'img'),
		getFetch('https://i.ibb.co/gT1Vq6q/CDI.png', 'img'),
		getFetch('https://i.ibb.co/8xGz1Xz/HOSPITAL.png', 'img'),
		getFetch('https://i.ibb.co/D7SwCJW/CPT1.png', 'img'),
		getFetch('https://i.ibb.co/QY879dr/CPT2.png', 'img'),
		getFetch('https://i.ibb.co/tJM3Ps2/RAES.png', 'img')
	])
	.then(objArray => {
		console.log(objArray);
	})
	.catch((error) => {
		console.log(error);
	})
	
}

window.addEventListener('load', init, false);