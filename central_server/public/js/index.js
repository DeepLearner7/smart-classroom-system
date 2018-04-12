$(document).ready(function () {

	$(".toggler").on("click", function() {
		$(".auth-page-container").toggleClass("flip");
	});

});
document.getElementById('main-btn').addEventListener('click', function(){
	
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/click', true);
	xhr.onreadystatechange = function(){
		if (this.readyState == 4 && this.status == 200) {
		var parent = document.getElementById('imgMark').parentNode;
		document.getElementById('imgMark').parentNode.removeChild(document.getElementById('imgMark'));
		var newimg = document.createElement('img');
		newimg.setAttribute('id', 'imgMark');
		newimg.setAttribute('src', '/photo/capture');
		newimg.setAttribute('style', 'width: 50%;margin-top: 50px;');
		parent.appendChild(newimg);
		setTimeout(function(){
			$('#markatt').fadeIn('slow');
			}, 1000);
		}
	}
	xhr.send();
});
var backBtn = function(){
	$('#markatt').fadeOut('slow');
}