function closeSidebar(e){
	e.preventDefault();
	var btn = e.target;
	const sidebar = document.querySelector('div.sidebar');
	
	btn.disabled = true;
	sidebar.classList.add('translate-background');
	setTimeout(function(){
		sidebar.classList.remove('translate-background');
		sidebar.classList.remove('showSidebar');
		sidebar.classList.add('hiddenSidebar');
		btn.removeAttribute('disabled');
	}, 2000);
}

function init(){
	const elementBtnClose = ['a.closebtn', 'button.btn-close'];
	
	elementBtnClose.forEach(elem => {
		var btn = document.querySelector(elem);
		
		btn.addEventListener('click', closeSidebar, false);
	})
	
}

window.addEventListener('load', init, false);