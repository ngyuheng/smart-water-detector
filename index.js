function dismissAlert() {
    const alertElement = document.querySelector('.alert-card-container');
    if (alertElement) {
        alertElement.style.display = 'none';
    }
    console.log('Alert dismissed');
}