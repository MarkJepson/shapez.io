/* typehints:start */
import { GameRoot } from "./root";
/* typehints:end */

import { createLogger } from "../core/logging";
import { BeltSystem } from "./systems/belt";
import { ItemEjectorSystem } from "./systems/item_ejector";
import { MapResourcesSystem } from "./systems/map_resources";
import { MinerSystem } from "./systems/miner";
import { ItemProcessorSystem } from "./systems/item_processor";
import { UndergroundBeltSystem } from "./systems/underground_belt";
import { HubSystem } from "./systems/hub";
import { StaticMapEntitySystem } from "./systems/static_map_entity";
import { ItemAcceptorSystem } from "./systems/item_acceptor";
import { StorageSystem } from "./systems/storage";
import {
    allCustomBuildingData,
    getCustomBuildingSystemsNulled,
    internalInitSystemsAddAt,
} from "./custom/buildings";

const logger = createLogger("game_system_manager");

export class GameSystemManager {
    /**
     *
     * @param {GameRoot} root
     */
    constructor(root) {
        this.root = root;

        this.systems = {
            /* typehints:start */
            /** @type {BeltSystem} */
            belt: null,

            /** @type {ItemEjectorSystem} */
            itemEjector: null,

            /** @type {MapResourcesSystem} */
            mapResources: null,

            /** @type {MinerSystem} */
            miner: null,

            /** @type {ItemProcessorSystem} */
            itemProcessor: null,

            /** @type {UndergroundBeltSystem} */
            undergroundBelt: null,

            /** @type {HubSystem} */
            hub: null,

            /** @type {StaticMapEntitySystem} */
            staticMapEntities: null,

            /** @type {ItemAcceptorSystem} */
            itemAcceptor: null,

            /** @type {StorageSystem} */
            storage: null,

            /* typehints:end */

            ...getCustomBuildingSystemsNulled(),
        };
        this.systemUpdateOrder = [];

        this.internalInitSystems();
    }

    /**
     * Initializes all systems
     */
    internalInitSystems() {
        const add = (id, systemClass) => {
            this.systems[id] = new systemClass(this.root);
            this.systemUpdateOrder.push(id);
        };

        // Order is important!

        internalInitSystemsAddAt(0, add);

        add("belt", BeltSystem);
        internalInitSystemsAddAt(1, add);

        add("undergroundBelt", UndergroundBeltSystem);
        internalInitSystemsAddAt(2, add);

        add("miner", MinerSystem);
        internalInitSystemsAddAt(3, add);

        add("storage", StorageSystem);
        internalInitSystemsAddAt(4, add);

        add("itemProcessor", ItemProcessorSystem);
        internalInitSystemsAddAt(5, add);

        add("itemEjector", ItemEjectorSystem);
        internalInitSystemsAddAt(6, add);

        add("mapResources", MapResourcesSystem);
        internalInitSystemsAddAt(7, add);

        add("hub", HubSystem);
        internalInitSystemsAddAt(8, add);

        add("staticMapEntities", StaticMapEntitySystem);
        internalInitSystemsAddAt(9, add);

        add("itemAcceptor", ItemAcceptorSystem);
        internalInitSystemsAddAt(NaN, add);

        logger.log("📦 There are", this.systemUpdateOrder.length, "game systems");
    }

    /**
     * Updates all systems
     */
    update() {
        for (let i = 0; i < this.systemUpdateOrder.length; ++i) {
            const system = this.systems[this.systemUpdateOrder[i]];
            system.update();
        }
    }

    refreshCaches() {
        for (let i = 0; i < this.systemUpdateOrder.length; ++i) {
            const system = this.systems[this.systemUpdateOrder[i]];
            system.refreshCaches();
        }
    }
}
