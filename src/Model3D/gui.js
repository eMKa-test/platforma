import { GUI } from "dat.gui";

class Gui extends GUI {
    constructor(dom) {
        super(dom);
        this.dom = dom;
        this.items = {};
        this.appendGui();
    }

    folder(name, subName) {
        if (!subName) {
            this.items[name] = this.addFolder(name);
        } else {
            if (!this.items[name]) {
                this.items[name] = this.addFolder(name);
                this.items[name][subName] = this.items[name].addFolder(subName);
            } else {
                this.items[name][subName] = this.items[name].addFolder(subName);
            }
        }
    }

    changeProperties(type, object, param, props, onChangeFn) {
        this.items[type].add(object, param, ...props).onChange(onChangeFn);
    }

    changeSubProperties(type, subType, object, param, props, onChangeFn) {
        if (subType && this.items[type][subType]) {
            this.items[type][subType].add(object, param, ...props).onChange(onChangeFn);
        } else {
            this.items[type][subType] = this.items[type].addFolder(subType);
            this.items[type][subType].add(object, param, ...props).onChange(onChangeFn);
        }
    }

    addColor(type, object, color, onChangeFN) {
        this.items[type].addColor(object, color);
    }

    appendGui() {
        const guiContainer = document.createElement("div");
        guiContainer.id = "gui-container";
        guiContainer.appendChild(this.domElement);
        this.dom.parentNode.appendChild(guiContainer);
    }
}

export { Gui };
export default null;
