class Api {
    constructor({ address }) {
        // стандартная реализация — объект options
        this._address = address;
    }
}

const api = new Api({
    //address: 'http://localhost:3001',
    address: 'https://nomoreparties.co',
});

export default api;