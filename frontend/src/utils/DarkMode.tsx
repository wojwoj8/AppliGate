const DarkMode = () => {
    const body = document.querySelector('body');
    
    if (body) {
        if (body.id === 'dark') {
          body.id = '';
          localStorage.setItem('mode', '');
        } else {
          body.id = 'dark';
          localStorage.setItem('mode', 'dark');
        }
      }
};

export default DarkMode;