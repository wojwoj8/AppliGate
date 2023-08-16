const DarkMode = () => {
    const body = document.querySelector('body');

    if (body) {
        if (body.id === 'light') {
            body.id = '';
            localStorage.setItem('mode', '');
        } else {
            body.id = 'light';
            localStorage.setItem('mode', 'light');
        }
    }
};

export default DarkMode;