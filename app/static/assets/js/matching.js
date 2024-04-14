document.querySelectorAll('.word-card').forEach(card => {
    card.addEventListener('dragstart', function(event) {
        event.dataTransfer.setData('text/plain', event.target.dataset.match);
    });
});

document.querySelectorAll('.answer-box').forEach(box => {
    box.addEventListener('dragover', function(event) {
        event.preventDefault();  // Necessary to allow dropping
    });

    box.addEventListener('drop', function(event) {
        event.preventDefault();
        const matchingValue = event.dataTransfer.getData('text/plain');
        if (box.dataset.match === matchingValue) {
            box.textContent = document.querySelector(`.word-card[data-match="${matchingValue}"]`).textContent;
            box.style.backgroundColor = '#ccffcc'; // Change color if correct
        } else {
            box.style.backgroundColor = '#ffcccc'; // Change color if incorrect
        }
    });
});