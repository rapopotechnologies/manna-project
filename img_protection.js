document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    var targetElement = event.target;
    if (targetElement.tagName === 'IMG' && targetElement.parentNode.tagName === 'A') {
        var openLink = confirm("Do you want to open the link in a new tab?");
        if (openLink) {
            window.open(targetElement.parentNode.href, '_blank');
        }
    }
});
