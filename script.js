document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    // Funzione per impostare e salvare il tema
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    // 1. Controlla se c'è un tema salvato in precedenza
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        // Applica il tema salvato
        setTheme(savedTheme);
    } else {
        // 2. Altrimenti usa la preferenza del browser/sistema
        setTheme(prefersDarkScheme.matches ? 'dark' : 'light');
    }

    // Cambia tema dinamicamente al click
    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    // Ascolta i cambiamenti delle impostazioni di sistema in tempo reale
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
});
