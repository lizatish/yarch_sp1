import React from "react";
import {Route, Switch, useHistory} from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";

const ProtectedRoute = lazy(() => import('users/ProtectedRoute').catch(() => {
        return {default: () => <div className='error'>Component ProtectedRoute is not available!</div>};
    })
)

const CurrentUserContext = lazy(() => import('users/CurrentUserContext').catch(() => {
        return {default: () => <div className='error'>Component CurrentUserContext is not available!</div>};
    })
)
const InfoTooltip = lazy(() => import('auth/InfoTooltip').catch(() => {
        return {default: () => <div className='error'>Component InfoTooltip is not available!</div>};
    })
)
const EditProfilePopup = lazy(() => import('users/EditProfilePopup').catch(() => {
        return {default: () => <div className='error'>Component EditProfilePopup is not available!</div>};
    })
)
const EditAvatarPopup = lazy(() => import('users/EditAvatarPopup').catch(() => {
        return {default: () => <div className='error'>Component AddPlacePopup is not available!</div>};
    })
)
const AddPlacePopup = lazy(() => import('users/AddPlacePopup').catch(() => {
            return {default: () => <div className='error'>Component AddPlacePopup is not available!</div>};
        })
    )
;const Login = lazy(() => import('auth/Login').catch(() => {
        return {default: () => <div className='error'>Component Login is not available!</div>};
    })
);
const Register = lazy(() => import('auth/Register').catch(() => {
        return {default: () => <div className='error'>Component Register is not available!</div>};
    })
);
const PopupWithForm = lazy(() => import('users/PopupWithForm').catch(() => {
        return {default: () => <div className='error'>Component PopupWithForm is not available!</div>};
    })
);

const ImagePopup = lazy(() => import('cards/ImagePopup').catch(() => {
        return {default: () => <div className='error'>Component ImagePopup is not available!</div>};
    })
);


function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
        React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
        React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [cards, setCards] = React.useState([]);

    // В корневом компоненте App создана стейт-переменная currentUser. Она используется в качестве значения для провайдера контекста.
    const [currentUser, setCurrentUser] = React.useState({});

    const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
    const [tooltipStatus, setTooltipStatus] = React.useState("");

    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    //В компоненты добавлены новые стейт-переменные: email — в компонент App
    const [email, setEmail] = React.useState("");

    const history = useHistory();

    /// Три следующих хендлера слушают события, которые придут от сервисов пользователей, карточек и авторизации после старта приложения.
    /// Предполагается, что хост сразу после старта создаст событие, на которое будут подписаны вышеуказанные сервисы.
    /// После этого сервисы сделают определенные действия, и создадут события, которые прослушают хендлеры снизу.
    /// После этого приложение полноценно стартанет
    const handleUserDataUpdate = event => { // Эта функция получает нотификации об обновлениях аватара
        setCurrentUser(event.detail);
    }
    const handleCardDataUpdate = event => { // Эта функция получает нотификации об обновлениях карточек
        setCards(event.detail);
    }

    const handleCheckToken = event => { // Эта функция получает нотификации об обновлениях аватара
        setEmail(res.data.email);
        setIsLoggedIn(true);
        history.push("/");
        //     .catch((err) => {
        //                     localStorage.removeItem("jwt");
        //                     console.log(err);
        //                 });
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function closeAllPopups() {
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setIsInfoToolTipOpen(false);
        setSelectedCard(null);
    }

    function handleCardClick(card) {
        setSelectedCard(card);
    }

    const handleUpdateUser = event => { // Эта функция получает нотификации о событиях обновления юзера
        setCurrentUser(event.detail);
        closeAllPopups();
    }

    const handleUpdateAvatar = event => { // Эта функция получает нотификации об обновлениях аватара
        setCurrentUser(event.detail);
        closeAllPopups();
    }

    const handleCardLike = event => { // Эта функция получает нотификации об обновлениях аватара
        setCards((cards) =>
            cards.map((c) => (c._id === card._id ? event.detail : c))
        );
    }

    const handleAddPlaceSubmit = event => { // Эта функция получает нотификации об обновлениях аватара
        setCards([event.detail, ...cards]);
        closeAllPopups();
    }


    const onRegister = event => { // Эта функция получает нотификации о регистрации пользователя
        setTooltipStatus("success");
        setIsInfoToolTipOpen(true);
        history.push("/signin");
        // catch
        //     ((err) => {
        //         setTooltipStatus("fail");
        //         setIsInfoToolTipOpen(true);
        //     });
    }


    function onSignOut() {
        // при вызове обработчика onSignOut происходит удаление jwt
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        // После успешного вызова обработчика onSignOut происходит редирект на /signin
        history.push("/signin");
    }

    return (
        // В компонент App внедрён контекст через CurrentUserContext.Provider
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page__content">
                <Header email={email} onSignOut={onSignOut}/>
                <Switch>
                    <ProtectedRoute
                        exact
                        path="/"
                        component={Main}
                        cards={cards}
                        onEditProfile={handleEditProfileClick}
                        onAddPlace={handleAddPlaceClick}
                        onEditAvatar={handleEditAvatarClick}
                        onCardClick={handleCardClick}
                        onCardLike={handleCardLike}
                        onCardDelete={handleCardDelete}
                        loggedIn={isLoggedIn}
                    />
                    <Route path="/signup">
                        <Register onRegister={onRegister}/>
                    </Route>
                    <Route path="/signin">
                        <Login onLogin={onLogin}/>
                    </Route>
                </Switch>
                <Footer/>
                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onUpdateUser={handleUpdateUser}
                    onClose={closeAllPopups}
                />
                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onAddPlace={handleAddPlaceSubmit}
                    onClose={closeAllPopups}
                />
                <PopupWithForm title="Вы уверены?" name="remove-card" buttonText="Да"/>
                <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    onUpdateAvatar={handleUpdateAvatar}
                    onClose={closeAllPopups}
                />
                <ImagePopup card={selectedCard} onClose={closeAllPopups}/>
                <InfoTooltip
                    isOpen={isInfoToolTipOpen}
                    onClose={closeAllPopups}
                    status={tooltipStatus}
                />
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
