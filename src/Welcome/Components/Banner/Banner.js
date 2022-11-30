import React, { Component } from 'react';

import mouse from './assets/mouse.png';

class Banner extends Component {
    render() {
        return (
            <React.Fragment>
                <h1 className="Banner-title">Platforma</h1>
                <p className="Banner-text">
                Платформа — универсальный инструмент независимого контроля за объектами заказчика. Данный сервис собирает разнообразные данные о процессе строительства и накапливает их в закрытой части сайта, доступной только авторизованным пользователям. Фото, видео, панорамы объектов, а также ключевые параметры, такие как данные о людских ресурсах, материальных остатках, статистические сводки об использовании спецтехники — все это доступно для изучения
                и анализа, а хронологическая лента данных позволяет получить представление о процессе в ретроспективе.
                </p>
                <img className="Banner-mouseicon" src={mouse} alt="Иконка мыши" width="21"/>
            </React.Fragment>
        );
    }
}

export default Banner;