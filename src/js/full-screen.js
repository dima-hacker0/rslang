const fullScreenAudioCall = document.querySelector('#full-screen-audiocall');

document.addEventListener('click', function (event) {
    if (!event.target.classList.contains('full-screen')) return;
    if (document.fullscreenElement) {
     document.exitFullscreen();
     fullScreenAudioCall.src = 'src/img/svg/fullscreen.svg';
     fullScreenAudioCall.style.width = '45px';
     fullScreenAudioCall.style.top = '13px';
     fullScreenAudioCall.style.right = '55px';
    } else {
     document.documentElement.requestFullscreen();
     fullScreenAudioCall.src = 'src/img/svg/fullscreen-exit.svg';
     fullScreenAudioCall.style.width = '30px';
     fullScreenAudioCall.style.top = '18px';
     fullScreenAudioCall.style.right = '60px';
    }
});
