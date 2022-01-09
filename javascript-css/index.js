function closeSidebar(e){
	e.preventDefault();
	const sidebar = document.querySelector('div.sidebar');
	
	sidebar.classList.remove('showSidebar');
	sidebar.classList.add('hiddenSidebar');
}

function init(){
	const elementBtnClose = ['a.closebtn', 'button.btn-close'];
	
	elementBtnClose.forEach(elem => {
		var btn = document.querySelector(elem);
		
		btn.addEventListener('click', closeSidebar, false);
	})
	
}

window.addEventListener('load', init, false);