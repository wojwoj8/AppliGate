const setInitialMode = () => {
    const initialMode = localStorage.getItem('mode');
    if (initialMode === '') {
        const body = document.querySelector('body');
        if (body) {
            body.id = '';
        }
    }
};
export default setInitialMode;