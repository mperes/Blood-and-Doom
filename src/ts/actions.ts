on('clicked:rest', () => {
    setAttrs({
        bruises: '',
        scrapes: '',
        wounds: '',
        madness: ''
    });
});

on('clicked:momentum-pool-clear', () => {
    setAttrs({
        'momentum-pool': 0
    });
});
