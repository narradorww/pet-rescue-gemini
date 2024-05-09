"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessLayer = void 0;
const controls_layer_1 = require("./controls.layer");
class BusinessLayer extends controls_layer_1.ControlsLayer {
    page;
    browser;
    constructor(page, browser) {
        super(browser, page);
        this.page = page;
        this.browser = browser;
    }
    /**
     * Querys product catalog
     * @param id Buisness profile id ('00000@c.us')
     */
    async getBusinessProfilesProducts(id) {
        return this.page.evaluate(({ id }) => {
            WAPI.getBusinessProfilesProducts(id);
        }, { id });
    }
    /**
     * Sends product with product image to given chat id
     * @param to Chat id
     * @param base64 Base64 image data
     * @param caption Message body
     * @param businessId Business id number that owns the product ('0000@c.us')
     * @param productId Product id, see method getBusinessProfilesProducts for more info
     */
    async sendImageWithProduct(to, base64, caption, businessId, productId) {
        return this.page.evaluate(({ to, base64, businessId, caption, productId }) => {
            WAPI.sendImageWithProduct(base64, to, caption, businessId, productId);
        }, { to, base64, businessId, caption, productId });
    }
}
exports.BusinessLayer = BusinessLayer;
//# sourceMappingURL=business.layer.js.map