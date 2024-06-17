function showPDF(id){
    document.getElementById(`embed-${id}-default`).classList = 'display-none';
    document.getElementById(`pdf-${id}`).classList = 'resource-container';
}

function closePDF(id){
    document.getElementById(`embed-${id}-default`).classList = 'w3-container flexbox flex-grow space-between';
    document.getElementById(`pdf-${id}`).classList = 'display-none';
}
